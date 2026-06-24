import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function TreeView() {
  const [tree, setTree] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/tree/full').then(r => setTree(r.data)).catch(() => {})
  }, [])

  const renderNode = (node, depth = 0) => (
    <div key={node.node_id} className="ml-6 border-l-2 border-green-200 pl-4 mt-2">
      <div className={lex items-center gap-3 p-3 rounded-xl }>
        <span className="text-2xl">{depth === 0 ? 'ðŸ''  : depth === 1 ? 'ðŸŒ³' : 'ðŸŒ±'}</span>
        <div>
          <p className={ont-bold }>{node.username}</p>
          <p className={	ext-xs }>Level {node.level} â€¢ {node.channel_count} channels â€¢ {node.total_referrals} referrals</p>
        </div>
      </div>
      {node.children?.map(child => renderNode(child, depth + 1))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">ðŸŒ³ My Tree</h1>
          <button onClick={() => navigate('/dashboard')} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-xl dark:text-white">â† Back</button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          {tree ? renderNode(tree) : <div className="text-center py-12 text-gray-500">Loading your tree...</div>}
        </div>
      </div>
    </div>
  )
}
