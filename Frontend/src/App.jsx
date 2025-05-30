import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(``)
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      setIsLoading(true)
      const response = await axios.post('/ai/get-review', { code })
      setReview(response.data)
    } catch (error) {
      console.error('Error getting review:', error)
      setReview('Error getting review. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function clearAll() {
    setCode('')
    setReview('')
  }

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <header>
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <h1>Code Review Assistant</h1>
          </div>
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="left">
          <div className="editor-header">
            <h2>Code Editor</h2>
            <div className="editor-actions">
              <button
                onClick={clearAll}
                className="clear-button"
                title="Clear all content"
              >
                <span className="button-icon">🗑️</span>
                Clear
              </button>
            </div>
          </div>
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <button
            onClick={reviewCode}
            disabled={isLoading}
            className={`review-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="button-icon">🔍</span>
                Get Code Review
              </>
            )}
          </button>
        </div>
        <div className="right">
          <div className="review-header">
            <h2>Code Review</h2>
          </div>
          {review ? (
            <Markdown
              rehypePlugins={[rehypeHighlight]}
              className="review-content"
            >
              {review}
            </Markdown>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <p>Your code review will appear here</p>
              <p className="hint">Click "Get Code Review" to analyze your code</p>
            </div>
          )}
        </div>
      </main>
      <footer className="copyright">
        <p>© {new Date().getFullYear()} Made with ❤️ by Bhairav Kr</p>
      </footer>
    </div>
  )
}

export default App
