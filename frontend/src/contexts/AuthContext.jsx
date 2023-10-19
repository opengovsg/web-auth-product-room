import { useState, useEffect, createContext, useCallback } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

export const AuthContext = createContext()

export function AuthContextProvider() {
  const [loggedInEmail, setLoggedInEmail] = useState(null)
  const navigate = useNavigate()

  const fetchWhoAmI = useCallback(() => {
    fetch('/api/common/whoami', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ email }) => {
        if (email) {
          setLoggedInEmail(email)
        }
      })
  }, [])

  const logout = useCallback(() => {
    fetch('/api/common/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(() => {
        setLoggedInEmail(null)
      })
  }, [])

  useEffect(() => {
    fetchWhoAmI()
  }, [fetchWhoAmI])

  return (
    <AuthContext.Provider value={{ fetchWhoAmI }}>
      <button
        style={{ position: 'absolute', top: 10, left: 10 }}
        onClick={() => navigate('/')}
      >
        🏠 Home
      </button>
      {loggedInEmail && (
        <div className="logged-in-card">
          <span style={{ marginRight: '10px' }}>{loggedInEmail}</span>
          <button style={{ background: '#ff6961' }} onClick={logout}>
            Logout
          </button>
        </div>
      )}
      <Outlet />
    </AuthContext.Provider>
  )
}
