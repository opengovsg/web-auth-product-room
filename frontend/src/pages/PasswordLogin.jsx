import { useState, useCallback } from 'react'

function PasswordLogin() {
  const [activeTab, setActiveTab] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')

  const resetForm = useCallback(() => {
    setUsername('')
    setPassword('')
    setRetypePassword('')
  }, [])

  const switchTab = useCallback(
    (tab) => {
      setActiveTab(tab)
      resetForm()
    },
    [resetForm],
  )

  const register = useCallback(() => {
    if (password !== retypePassword) {
      alert('Password not match')
      return
    }
    fetch('/api/password/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ message }) => alert(message))
      .then(resetForm)
  }, [password, retypePassword, username, resetForm])

  const login = useCallback(() => {
    fetch('/api/password/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ message }) => alert(message))
      .then(resetForm)
  }, [username, password, resetForm])

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault()
      if (activeTab === 0) {
        register()
      } else {
        login()
      }
    },
    [activeTab, register, login],
  )

  return (
    <div>
      <div className="tabs">
        <div
          className={`tab ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => switchTab(0)}
        >
          Register
        </div>
        <div
          className={`tab ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => switchTab(1)}
        >
          Login
        </div>
      </div>
      <form onSubmit={handleLogin}>
        <div className="vertical-card">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {activeTab === 0 && (
            <input
              placeholder="Retype password"
              type="password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
          )}
          <button onClick={handleLogin}>
            {activeTab === 0 ? 'Register' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PasswordLogin
