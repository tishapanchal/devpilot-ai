import { useState, useRef, useEffect } from 'react'

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: '👋 Hello! I am DevPilot AI\nAsk me anything about your code!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

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
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error connecting to AI!' }])
    }

    setLoading(false)
  }

  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      color: '#ffffff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: '#252526',
        borderBottom: '1px solid #3c3c3c',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#4fc3f7'
      }}>
        🚀 DevPilot AI
      </div>

      {/* Chat */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            padding: '12px 16px',
            borderRadius: '8px',
            maxWidth: '80%',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '#0e639c' : '#2d2d2d',
            border: msg.role === 'ai' ? '1px solid #3c3c3c' : 'none'
          }}>
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#2d2d2d',
            borderRadius: '8px',
            alignSelf: 'flex-start',
            border: '1px solid #3c3c3c',
            color: '#4fc3f7'
          }}>
            thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '15px',
        backgroundColor: '#252526',
        borderTop: '1px solid #3c3c3c',
        display: 'flex',
        gap: '10px'
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
          placeholder="Ask anything about your code..."
          style={{
            flex: 1,
            backgroundColor: '#3c3c3c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '14px',
            resize: 'none',
            height: '60px',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            backgroundColor: '#0e639c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App