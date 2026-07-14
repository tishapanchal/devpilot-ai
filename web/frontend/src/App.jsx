import { useState, useRef, useEffect } from 'react'

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: '👋 Hello! I am DevPilot AI\n\nI can help you with:\n- 🐛 Debugging code\n- 💡 Code explanations\n- ✨ Code improvements\n- 📝 Documentation\n\nAsk me anything!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '❌ Error connecting to AI. Make sure the backend is running!' }])
    }
    setLoading(false)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0d0d0d',
    }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        backgroundColor: '#141414',
        borderRight: '1px solid #2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0'
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 20px 20px',
          borderBottom: '1px solid #2a2a2a'
        }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#4fc3f7' }}>
            🚀 DevPilot AI
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
            AI Developer Assistant
          </div>
        </div>

        {/* New Chat Button */}
        <div style={{ padding: '15px' }}>
          <button
            onClick={() => setMessages([{ role: 'ai', text: '👋 Hello! How can I help you today?' }])}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#1e1e1e',
              color: '#ffffff',
              border: '1px solid #3c3c3c',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              textAlign: 'left'
            }}
          >
            + New Chat
          </button>
        </div>

        {/* Features */}
        <div style={{ padding: '0 15px', marginTop: '10px' }}>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Features
          </div>
          {['🐛 Debug Code', '💡 Explain Code', '✨ Improve Code', '📝 Generate Docs'].map((item, i) => (
            <div key={i} style={{
              padding: '8px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#aaa',
              cursor: 'pointer',
              marginBottom: '4px'
            }}
              onMouseEnter={e => e.target.style.backgroundColor = '#1e1e1e'}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          marginTop: 'auto',
          padding: '15px 20px',
          borderTop: '1px solid #2a2a2a',
          fontSize: '12px',
          color: '#555'
        }}>
          DevPilot AI v1.0.0
        </div>
      </div>

      {/* Main Chat */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0d0d0d'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ea043' }} />
          <span style={{ fontSize: '14px', color: '#aaa' }}>AI is ready</span>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              {msg.role === 'ai' && (
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#1a3a4a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0
                }}>🚀</div>
              )}
              <div style={{
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: '70%',
                fontSize: '14px',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap',
                backgroundColor: msg.role === 'user' ? '#0e639c' : '#1a1a1a',
                border: msg.role === 'ai' ? '1px solid #2a2a2a' : 'none',
                color: '#ffffff'
              }}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#0e639c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0
                }}>👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1a3a4a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px'
              }}>🚀</div>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#1a1a1a',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid #2a2a2a',
                display: 'flex', gap: '6px', alignItems: 'center'
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4fc3f7',
                    animation: 'bounce 1s infinite',
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #2a2a2a',
          backgroundColor: '#0d0d0d'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #3c3c3c',
            borderRadius: '12px',
            padding: '12px 16px',
            alignItems: 'flex-end'
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Ask anything about your code... (Enter to send)"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                resize: 'none',
                height: '24px',
                maxHeight: '120px',
                outline: 'none',
                fontFamily: 'Segoe UI, sans-serif',
                lineHeight: '1.5'
              }}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#333' : '#0e639c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
            >
              {loading ? '...' : 'Send →'}
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#444', marginTop: '8px' }}>
            DevPilot AI can make mistakes. Always verify important code.
          </div>
        </div>
      </div>
    </div>
  )
}

export default App