from fastapi import FastAPI, Depends, HTTPException
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

SECRET_KEY = os.environ.get("SECRET_KEY", "changeme-secret-key-32chars-minimum")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
DATABASE_URL = os.environ.get("DATABASE_URL", "")

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
            logger.info("Database ready")
            await create_admin_user()
    except Exception as e:
        logger.warning(f"Startup: {e}")
    yield


async def create_admin_user():
    try:
        from app.database import SessionLocal
        from app.models.user import User
        from app.models.tree_node import TreeNode
        db = SessionLocal()
        existing = db.query(User).filter(
            (User.email == ADMIN_EMAIL) | (User.username == "admin")
        ).first()
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
            root = TreeNode(user_id=admin.id, parent_node_id=None, level=0)
            db.add(root)
            db.commit()
            logger.info(f"Admin created: {ADMIN_EMAIL}")
        db.close()
    except Exception as e:
        logger.warning(f"Admin setup: {e}")


app = FastAPI(title="MoneyTree API", version="1.0.0", lifespan=lifespan)

# Open CORS - allow ALL origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_db():
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from app.models.user import User
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid = payload.get("sub")
        user = db.query(User).filter(User.id == uid).first()
        if not user:
            raise HTTPException(401, "Invalid token")
        return user
    except JWTError:
        raise HTTPException(401, "Invalid token")


@app.get("/")
def root():
    return {"app": "MoneyTree", "status": "running", "version": "1.0.0"}


@app.get("/health")
def health():
    db_status = "not configured"
    try:
        from app.database import engine
        if engine:
            with engine.connect() as c:
                c.execute(text("SELECT 1"))
                db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)[:60]}"
    return {
        "status": "healthy",
        "database": db_status,
        "database_url_set": bool(DATABASE_URL),
        "admin_email": ADMIN_EMAIL,
        "port": os.environ.get("PORT", "8000")
    }


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

    logger.info(f"Register: {email} / {username}")

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(400, "Email already registered")
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(400, "Username already taken")
    if len(password) < 6:
        raise HTTPException(400, "Password too short (min 6 chars)")

    parent = None
    if invite_code:
        inv = db.query(Invite).filter(
            Invite.invite_code == invite_code,
            Invite.used == False
        ).first()
        if inv:
            parent = db.query(TreeNode).filter(TreeNode.user_id == inv.sender_id).first()
            inv.used = True
            sender = db.query(User).filter(User.id == inv.sender_id).first()
            if sender:
                sender.total_referrals += 1

    user = User(
        email=email,
        username=username,
        hashed_password=pwd_context.hash(password),
        is_admin=False,
        is_active=True,
        referral_code=secrets.token_urlsafe(8),
        referred_by_id=parent.user_id if parent else None,
        total_referrals=0
    )
    db.add(user)
    db.flush()
    db.add(TreeNode(
        user_id=user.id,
        parent_node_id=parent.id if parent else None,
        level=(parent.level + 1) if parent else 1
    ))
    db.add(Channel(
        owner_id=user.id,
        youtube_url=channel_url,
        channel_name=username + " Channel",
        is_admin_default=False,
        is_active=True,
        browse_order=11
    ))
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Register error: {e}")
        raise HTTPException(500, "Registration failed")
    
    token = create_token({"sub": str(user.id)})
    logger.info(f"User registered: {username}")
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "is_admin": user.is_admin
    }


@app.post("/api/auth/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    from app.models.user import User
    logger.info(f"Login attempt: {form_data.username}")
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        logger.warning(f"User not found: {form_data.username}")
        raise HTTPException(401, "No account with this email")
    if not pwd_context.verify(form_data.password, user.hashed_password):
        logger.warning(f"Wrong password: {form_data.username}")
        raise HTTPException(401, "Wrong password")
    token = create_token({"sub": str(user.id)})
    logger.info(f"Login OK: {user.username}")
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "is_admin": user.is_admin
    }


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


@app.post("/api/invite/generate")
async def gen_invite(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models.invite import Invite
    BASE_URL = os.environ.get("BASE_URL", "https://moneytube-frontend.onrender.com")
    code = secrets.token_urlsafe(12)
    link = f"{BASE_URL}/register?invite={code}"
    inv = Invite(sender_id=current_user.id, invite_code=code, invite_link=link, used=False)
    db.add(inv)
    db.commit()
    return {"invite_code": code, "invite_link": link}


@app.get("/api/invite/validate/{invite_code}")
async def validate_invite(invite_code: str, db: Session = Depends(get_db)):
    from app.models.invite import Invite
    from app.models.user import User
    inv = db.query(Invite).filter(
        Invite.invite_code == invite_code,
        Invite.used == False
    ).first()
    if not inv:
        return {"valid": False}
    sender = db.query(User).filter(User.id == inv.sender_id).first()
    return {"valid": True, "invited_by": sender.username if sender else "Unknown"}


@app.get("/api/browse/stats")
async def stats(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models.browse_log import BrowseLog
    from app.models.tree_node import TreeNode
    from sqlalchemy import func
    total = db.query(func.count(BrowseLog.id)).filter(BrowseLog.user_id == current_user.id).scalar() or 0
    success = db.query(func.count(BrowseLog.id)).filter(
        BrowseLog.user_id == current_user.id,
        BrowseLog.status == "success"
    ).scalar() or 0
    node = db.query(TreeNode).filter(TreeNode.user_id == current_user.id).first()
    return {
        "total_browsed": total,
        "successful": success,
        "failed": total - success,
        "success_rate": round(success / total * 100, 1) if total > 0 else 0,
        "level": node.level if node else 1,
        "tree_size": db.query(func.count(TreeNode.id)).scalar() or 0,
        "points": 0
    }


@app.get("/api/browse/logs")
async def get_logs(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return []


@app.get("/api/admin/overview")
async def admin_overview(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(403)
    from app.models.user import User
    from app.models.channel import Channel
    from app.models.tree_node import TreeNode
    from app.models.invite import Invite
    from sqlalchemy import func
    return {
        "total_users": db.query(func.count(User.id)).scalar() or 0,
        "total_channels": db.query(func.count(Channel.id)).scalar() or 0,
        "tree_nodes": db.query(func.count(TreeNode.id)).scalar() or 0,
        "jobs_today": 0,
        "success_rate": 0,
        "active_invites": db.query(func.count(Invite.id)).filter(Invite.used == False).scalar() or 0,
        "revenue_today": 0.0,
        "points_awarded_today": 0,
        "new_users_today": 0,
        "browse_running": 0
    }


@app.get("/api/admin/users")
async def admin_users(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(403)
    from app.models.user import User
    users = db.query(User).all()
    return [{
        "id": str(u.id),
        "email": u.email,
        "username": u.username,
        "is_admin": u.is_admin,
        "is_active": u.is_active,
        "total_referrals": u.total_referrals,
        "created_at": str(u.created_at)
    } for u in users]


@app.get("/api/admin/channels")
async def admin_channels(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(403)
    from app.models.channel import Channel
    chs = db.query(Channel).all()
    return [{
        "id": str(c.id),
        "channel_name": c.channel_name,
        "youtube_url": c.youtube_url,
        "is_admin_default": c.is_admin_default,
        "is_locked": c.is_locked,
        "is_active": c.is_active,
        "platform": c.platform
    } for c in chs]


@app.post("/api/admin/channels/add")
async def add_channel(
    youtube_url: str,
    channel_name: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(403)
    from app.models.channel import Channel
    from sqlalchemy import func
    count = db.query(func.count(Channel.id)).filter(Channel.is_admin_default == True).scalar() or 0
    if count >= 10:
        raise HTTPException(400, "Max 10 channels")
    ch = Channel(
        owner_id=current_user.id,
        youtube_url=youtube_url,
        channel_name=channel_name,
        is_admin_default=True,
        is_locked=True,
        is_active=True,
        browse_order=count + 1
    )
    db.add(ch)
    db.commit()
    return {"success": True}


@app.get("/api/leaderboard/top-inviters")
async def leaderboard(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models.user import User
    users = db.query(User).filter(User.is_active == True).order_by(
        User.total_referrals.desc()
    ).limit(50).all()
    return [{
        "rank": i + 1,
        "username": u.username,
        "total_referrals": u.total_referrals,
        "points": 0,
        "is_current_user": str(u.id) == str(current_user.id)
    } for i, u in enumerate(users)]
