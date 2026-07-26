import { useEffect, useState } from 'react'
import './App.css'

const mfrNameMap = {
  A: 'American Home Food Products',
  G: 'General Mills',
  K: 'Kelloggs',
  N: 'Nabisco',
  P: 'Post',
  Q: 'Quaker Oats',
  R: 'Ralston Purina'
}

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('Search the cereal dataset by name')
  const [loading, setLoading] = useState(false)
  const [sampleNames, setSampleNames] = useState([])
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantMessages, setAssistantMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I can recommend cereals from the dataset based on taste, crunch, fiber, or sweetness.'
    }
  ])
  const [assistantLoading, setAssistantLoading] = useState(false)

  useEffect(() => {
    const loadSampleNames = async () => {
      try {
        const response = await fetch('/api/cereals')
        if (!response.ok) {
          throw new Error('Backend unavailable')
        }

        const data = await response.json()
        setSampleNames((data.cereals || []).slice(0, 6).map((cereal) => cereal.name))
      } catch (error) {
        setSampleNames([])
      }
    }

    loadSampleNames()
  }, [])

  useEffect(() => {
    const trimmed = query.trim()

    const runSearch = async () => {
      if (!trimmed) {
        setResults([])
        setStatus('Search the cereal dataset by name')
        return
      }

      setLoading(true)

      try {
        const response = await fetch(`/api/cereals?name=${encodeURIComponent(trimmed)}`)
        if (!response.ok) {
          throw new Error('Backend unavailable')
        }

        const data = await response.json()
        setResults(data.cereals || [])
        setStatus(data.cereals?.length ? `${data.cereals.length} match${data.cereals.length > 1 ? 'es' : ''} found` : 'No cereals matched that name')
      } catch (error) {
        setResults([])
        setStatus('The backend is unavailable right now')
      } finally {
        setLoading(false)
      }
    }

    const timer = window.setTimeout(runSearch, 250)
    return () => window.clearTimeout(timer)
  }, [query])

  const handleAssistantSubmit = async (event) => {
    event.preventDefault()

    const trimmed = assistantInput.trim()
    if (!trimmed || assistantLoading) {
      return
    }

    const userMessage = { id: Date.now(), role: 'user', content: trimmed }
    setAssistantMessages((previous) => [...previous, userMessage])
    setAssistantInput('')
    setAssistantLoading(true)

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: trimmed
      })

      if (!response.ok) {
        throw new Error('Assistant unavailable')
      }

      const data = await response.json()
      setAssistantMessages((previous) => [
        ...previous,
        { id: Date.now() + 1, role: 'assistant', content: data.reply || 'I could not generate a response right now.' }
      ])
    } catch (error) {
      setAssistantMessages((previous) => [
        ...previous,
        { id: Date.now() + 2, role: 'assistant', content: 'The assistant is temporarily unavailable. Please try again in a moment.' }
      ])
    } finally {
      setAssistantLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Cereal Finder</p>
        <h1>Search cereals by name in seconds.</h1>
        <p className="hero-copy">
          Search the Kaggle cereal dataset by name and inspect the values returned from the backend.
        </p>

        <label className="search-box" htmlFor="cereal-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 0 8.5 8.5" />
          </svg>
          <input
            id="cereal-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a cereal name from the dataset"
          />
        </label>

        <div className="chip-row">
          {sampleNames.map((name) => (
            <button key={name} type="button" className="chip" onClick={() => setQuery(name)}>
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="results-card">
        <div className="results-header">
          <div>
            <p className="section-label">Results</p>
            <h2>{query ? `Matches for “${query}”` : 'Dataset samples'}</h2>
          </div>
          <span className="status-pill">{loading ? 'Searching…' : status}</span>
        </div>

        <div className="result-list">
          {results.length > 0 ? (
            results.map((cereal) => (
              <article key={cereal.name} className="result-card">
                <div className="result-main">
                  <h3>{cereal.name}</h3>
                  <div className="meta-grid">
                    {Object.entries(cereal)
                      .filter(([key]) => !['name', 'category', 'tag'].includes(key))
                      .map(([key, value]) => {
                        const displayValue = key === 'mfr' ? (mfrNameMap[value] || value) : value

                        return (
                          <div key={key} className="meta-item">
                            <span className="meta-label">{key}</span>
                            <span className="meta-value">{displayValue || '—'}</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>No cereals found</h3>
              <p>Try another name from the dataset or use one of the sample suggestions above.</p>
            </div>
          )}
        </div>
      </section>

      <button type="button" className="assistant-fab" onClick={() => setAssistantOpen((open) => !open)}>
        {assistantOpen ? '✕' : '🤖'}
      </button>

      {assistantOpen && (
        <section className="assistant-panel" aria-label="AI cereal assistant">
          <div className="assistant-header">
            <div>
              <p className="section-label">AI Assistant</p>
              <h2>Cereal recommendations</h2>
            </div>
            <button type="button" className="assistant-close" onClick={() => setAssistantOpen(false)}>
              Close
            </button>
          </div>

          <div className="assistant-messages">
            {assistantMessages.map((message) => (
              <div key={message.id} className={`assistant-bubble ${message.role}`}>
                {message.content}
              </div>
            ))}
            {assistantLoading && <div className="assistant-bubble assistant">Thinking…</div>}
          </div>

          <form className="assistant-form" onSubmit={handleAssistantSubmit}>
            <input
              value={assistantInput}
              onChange={(event) => setAssistantInput(event.target.value)}
              placeholder="Ask for a cereal recommendation"
            />
            <button type="submit" disabled={assistantLoading}>
              {assistantLoading ? '…' : 'Send'}
            </button>
          </form>
        </section>
      )}
    </div>
  )
}

export default App
