from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from sqlalchemy import text
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
import logging
import secrets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Settings from environment
DATABASE_URL = os.environ.get("DATABASE_URL", "")
SECRET_KEY = os.environ.get("SECRET_KEY", "changeme-secret-key-32chars-minimum")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("MoneyTree API Starting...")
    try:
        from app.database import engine, Base
        import app.models.user
        import app.models.channel
        import app.models.tree_node
        import app.models.invite
        import app.models.browse_log
        import app.models.points
        import app.models.revenue
        if engine:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")
            await create_admin_user()
    except Exception as e:
        logger.warning(f"Database setup skipped: {e}")
    yield
    logger.info("MoneyTree API Shutting down...")


async def create_admin_user():
    try:
        from app.database import SessionLocal
        from app.models.user import User
        from app.models.tree_node import TreeNode
        db = SessionLocal()
        existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if not existing:
            admin = User(
                email=ADMIN_EMAIL,
                username="admin",
                hashed_password=pwd_context.hash(ADMIN_PASSWORD),
                is_admin=True,
                is_active=True,
                referral_code=secrets.token_urlsafe(8),
                total_referrals=0
            )
            db.add(admin)
            db.flush()
            root_node = TreeNode(
                user_id=admin.id,
                parent_node_id=None,
                level=0
            )
            db.add(root_node)
            db.commit()
            logger.info(f"Admin user created: {ADMIN_EMAIL}")
        db.close()
    except Exception as e:
        logger.warning(f"Admin creation skipped: {e}")


app = FastAPI(
    title="MoneyTree Network API",
    description="YouTube Channel Growth Network",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def create_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_db():
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    from app.models.user import User
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ─── ROOT & HEALTH ────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "app": "MoneyTree Network",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    db_ok = False
    try:
        from app.database import engine
        if engine:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            db_ok = True
    except Exception:
        pass
    return {
        "status": "healthy",
        "database": "connected" if db_ok else "disconnected",
        "port": 8000
    }


# ─── AUTH ROUTES ──────────────────────────────────────────────────

@app.post("/api/auth/register")
async def register(
    email: str,
    username: str,
    password: str,
    channel_url: str,
    invite_code: Optional[str] = None,
    db: Session = Depends(get_db)
):
    from app.models.user import User
    from app.models.channel import Channel
    from app.models.tree_node import TreeNode
    from app.models.invite import Invite

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    parent_node = None
    if invite_code:
        invite = db.query(Invite).filter(
            Invite.invite_code == invite_code,
            Invite.used == False
        ).first()
        if invite:
            parent_node = db.query(TreeNode).filter(
                TreeNode.user_id == invite.sender_id
            ).first()
            invite.used = True
            inviter = db.query(User).filter(User.id == invite.sender_id).first()
            if inviter:
                inviter.total_referrals += 1

    user = User(
        email=email,
        username=username,
        hashed_password=pwd_context.hash(password),
        is_admin=False,
        is_active=True,
        referral_code=secrets.token_urlsafe(8),
        referred_by_id=parent_node.user_id if parent_node else None,
        total_referrals=0
    )
    db.add(user)
    db.flush()

    tree_node = TreeNode(
        user_id=user.id,
        parent_node_id=parent_node.id if parent_node else None,
        level=(parent_node.level + 1) if parent_node else 1
    )
    db.add(tree_node)

    channel = Channel(
        owner_id=user.id,
        youtube_url=channel_url,
        channel_name=f"{username} Channel",
        is_admin_default=False,
        is_active=True,
        browse_order=11
    )
    db.add(channel)
    db.commit()

    token = create_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "message": "Welcome to MoneyTree Network!",
        "user_id": str(user.id)
    }


@app.post("/api/auth/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    from app.models.user import User
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/api/auth/me")
async def me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "is_admin": current_user.is_admin,
        "total_referrals": current_user.total_referrals,
        "referral_code": current_user.referral_code
    }


@app.post("/api/auth/register-push-token")
async def register_push_token(
    fcm_token: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.fcm_token = fcm_token
    db.commit()
    return {"message": "Push token registered"}


# ─── INVITE ROUTES ────────────────────────────────────────────────

@app.post("/api/invite/generate")
async def generate_invite(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.invite import Invite
    BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
    invite_code = secrets.token_urlsafe(12)
    invite_link = f"{BASE_URL}/register?invite={invite_code}"
    invite = Invite(
        sender_id=current_user.id,
        invite_code=invite_code,
        invite_link=invite_link,
        used=False
    )
    db.add(invite)
    db.commit()
    return {
        "invite_code": invite_code,
        "invite_link": invite_link,
        "message": "Share this link to invite people!"
    }


@app.get("/api/invite/validate/{invite_code}")
async def validate_invite(invite_code: str, db: Session = Depends(get_db)):
    from app.models.invite import Invite
    from app.models.user import User
    invite = db.query(Invite).filter(
        Invite.invite_code == invite_code,
        Invite.used == False
    ).first()
    if not invite:
        return {"valid": False, "message": "Invalid or used invite code"}
    sender = db.query(User).filter(User.id == invite.sender_id).first()
    return {
        "valid": True,
        "invited_by": sender.username if sender else "Unknown",
        "message": f"Invited by {sender.username if sender else 'Unknown'}"
    }


@app.get("/api/invite/my-invites")
async def my_invites(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.invite import Invite
    invites = db.query(Invite).filter(
        Invite.sender_id == current_user.id
    ).all()
    return [
        {
            "code": i.invite_code,
            "link": i.invite_link,
            "used": i.used,
            "created_at": str(i.created_at)
        }
        for i in invites
    ]


# ─── TREE ROUTES ──────────────────────────────────────────────────

@app.get("/api/tree/full")
async def get_tree(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.tree_node import TreeNode
    from app.models.user import User
    from app.models.channel import Channel

    def build_node(node):
        user = db.query(User).filter(User.id == node.user_id).first()
        channels = db.query(Channel).filter(
            Channel.owner_id == node.user_id
        ).count()
        children = db.query(TreeNode).filter(
            TreeNode.parent_node_id == node.id
        ).all()
        return {
            "node_id": str(node.id),
            "user_id": str(node.user_id),
            "username": user.username if user else "Unknown",
            "level": node.level,
            "channel_count": channels,
            "total_referrals": user.total_referrals if user else 0,
            "children": [build_node(c) for c in children]
        }

    root = db.query(TreeNode).filter(TreeNode.level == 0).first()
    if not root:
        return {}
    return build_node(root)


# ─── BROWSE ROUTES ────────────────────────────────────────────────

@app.get("/api/browse/stats")
async def browse_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.browse_log import BrowseLog
    from app.models.tree_node import TreeNode
    from sqlalchemy import func

    total = db.query(func.count(BrowseLog.id)).filter(
        BrowseLog.user_id == current_user.id
    ).scalar() or 0

    successful = db.query(func.count(BrowseLog.id)).filter(
        BrowseLog.user_id == current_user.id,
        BrowseLog.status == "success"
    ).scalar() or 0

    node = db.query(TreeNode).filter(
        TreeNode.user_id == current_user.id
    ).first()

    tree_size = db.query(func.count(TreeNode.id)).scalar() or 0

    return {
        "total_browsed": total,
        "successful": successful,
        "failed": total - successful,
        "success_rate": round(successful / total * 100, 1) if total > 0 else 0,
        "level": node.level if node else 1,
        "tree_size": tree_size,
        "points": 0
    }


@app.get("/api/browse/logs")
async def browse_logs(
    limit: int = 20,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.browse_log import BrowseLog
    from app.models.channel import Channel

    logs = db.query(BrowseLog).filter(
        BrowseLog.user_id == current_user.id
    ).order_by(
        BrowseLog.executed_at.desc()
    ).limit(limit).all()

    result = []
    for log in logs:
        channel = db.query(Channel).filter(
            Channel.id == log.channel_id
        ).first()
        result.append({
            "channel_name": channel.channel_name if channel else "Unknown",
            "action": log.action,
            "status": log.status,
            "executed_at": str(log.executed_at)
        })
    return result


# ─── ADMIN ROUTES ─────────────────────────────────────────────────

@app.get("/api/admin/overview")
async def admin_overview(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    from app.models.user import User
    from app.models.channel import Channel
    from app.models.tree_node import TreeNode
    from app.models.browse_log import BrowseLog
    from app.models.invite import Invite
    from sqlalchemy import func

    total_users = db.query(func.count(User.id)).scalar() or 0
    total_channels = db.query(func.count(Channel.id)).scalar() or 0
    tree_nodes = db.query(func.count(TreeNode.id)).scalar() or 0
    total_logs = db.query(func.count(BrowseLog.id)).scalar() or 0
    success_logs = db.query(func.count(BrowseLog.id)).filter(
        BrowseLog.status == "success"
    ).scalar() or 0
    active_invites = db.query(func.count(Invite.id)).filter(
        Invite.used == False
    ).scalar() or 0

    return {
        "total_users": total_users,
        "total_channels": total_channels,
        "tree_nodes": tree_nodes,
        "jobs_today": total_logs,
        "success_rate": round(
            success_logs / total_logs * 100, 1
        ) if total_logs > 0 else 0,
        "active_invites": active_invites,
        "revenue_today": 0.00,
        "points_awarded_today": 0,
        "new_users_today": 0,
        "browse_running": 0
    }


@app.get("/api/admin/users")
async def admin_users(
    limit: int = 20,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    from app.models.user import User
    users = db.query(User).limit(limit).all()
    return [
        {
            "id": str(u.id),
            "email": u.email,
            "username": u.username,
            "is_admin": u.is_admin,
            "is_active": u.is_active,
            "total_referrals": u.total_referrals,
            "created_at": str(u.created_at)
        }
        for u in users
    ]


@app.post("/api/admin/channels/add")
async def add_admin_channel(
    youtube_url: str,
    channel_name: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    from app.models.channel import Channel
    from sqlalchemy import func

    count = db.query(func.count(Channel.id)).filter(
        Channel.is_admin_default == True
    ).scalar() or 0

    if count >= 10:
        raise HTTPException(
            status_code=400,
            detail="Maximum 10 admin channels allowed"
        )

    channel = Channel(
        owner_id=current_user.id,
        youtube_url=youtube_url,
        channel_name=channel_name,
        is_admin_default=True,
        is_locked=True,
        is_active=True,
        browse_order=count + 1
    )
    db.add(channel)
    db.commit()

    return {
        "success": True,
        "channel_id": str(channel.id),
        "message": f"Channel added and locked: {channel_name}"
    }


@app.get("/api/admin/channels")
async def admin_channels(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    from app.models.channel import Channel
    channels = db.query(Channel).all()
    return [
        {
            "id": str(c.id),
            "channel_name": c.channel_name,
            "youtube_url": c.youtube_url,
            "is_admin_default": c.is_admin_default,
            "is_locked": c.is_locked,
            "is_active": c.is_active,
            "platform": c.platform
        }
        for c in channels
    ]


@app.get("/api/leaderboard/top-inviters")
async def leaderboard(
    limit: int = 50,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.models.user import User
    users = db.query(User).filter(
        User.is_active == True
    ).order_by(
        User.total_referrals.desc()
    ).limit(limit).all()

    return [
        {
            "rank": i + 1,
            "username": u.username,
            "total_referrals": u.total_referrals,
            "points": 0,
            "badge": {
                "emoji": "👑" if i == 0 else "🌳" if i < 3 else "🌱",
                "name": "Tree King" if i == 0 else "Top Grower" if i < 3 else "Member"
            },
            "is_current_user": str(u.id) == str(current_user.id)
        }
        for i, u in enumerate(users)
    ]


@app.get("/api/points/summary")
async def points_summary(current_user=Depends(get_current_user)):
    return {
        "current_balance": 0,
        "total_earned": 0,
        "total_spent": 0,
        "cash_value": 0.00,
        "today_earned": 0,
        "cashout_available": False,
        "cashout_minimum": 500,
        "next_milestone": {"target": 500, "remaining": 500, "progress": 0},
        "points_breakdown": {
            "referral": 100,
            "browse": 5,
            "like": 10,
            "subscribe": 20,
            "daily_login": 15
        }
    }
