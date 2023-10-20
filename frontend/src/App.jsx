import { Link } from 'react-router-dom'

import logo from './assets/totoro.png'
import './App.css'

function App() {
  return (
    <>
      <img src={logo} className="logo" alt="logo" />
      <h1>W.A.R.P</h1>
      <div className="card">
        <Link to="/pw/login">
          <button>Password Login</button>
        </Link>
        <Link to="/otp/login">
          <button>Email + OTP Login</button>
        </Link>
      </div>
    </>
  )
}

export default App
