import React from 'react'
import { useNavigate } from 'react-router-dom'

function Landing() {
  var navigate = useNavigate()

  return React.createElement(
    'div',
    {
      style: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }
    },
    React.createElement(
      'div',
      { style: { textAlign: 'center', color: 'white', maxWidth: '500px', width: '100%' } },
      React.createElement('div', { style: { fontSize: '80px', marginBottom: '16px' } }, String.fromCodePoint(0x1F333)),
      React.createElement('h1', { style: { fontSize: '40px', fontWeight: 'bold', marginBottom: '12px', margin: '0 0 12px 0' } }, 'Money Tree Network'),
      React.createElement('p', { style: { color: '#bbf7d0', fontSize: '18px', marginBottom: '32px' } }, 'Grow your YouTube channels together'),
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' } },
        React.createElement(
          'button',
          {
            onClick: function() { navigate('/register') },
            style: { background: 'white', color: '#166534', padding: '14px 36px', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }
          },
          'Join Free'
        ),
        React.createElement(
          'button',
          {
            onClick: function() { navigate('/login') },
            style: { background: 'transparent', color: 'white', padding: '14px 36px', borderRadius: '50px', border: '2px solid white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }
          },
          'Login'
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '40px' } },
        [
          ['Auto Browse 25 Channels'],
          ['Earn Points and Rewards'],
          ['Leaderboard Rankings'],
          ['Custom Invite URLs']
        ].map(function(item) {
          return React.createElement(
            'div',
            { key: item[0], style: { background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', fontSize: '14px', color: '#bbf7d0' } },
            item[0]
          )
        })
      )
    )
  )
}

export default Landing
