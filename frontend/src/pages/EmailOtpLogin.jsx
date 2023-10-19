import { useState, useCallback, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

function EmailOtpLogin() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const { fetchWhoAmI } = useContext(AuthContext)

  const sendOtp = useCallback(() => {
    // Send an API request to your server to send the OTP to the user's email.
    fetch('/api/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(() => {
        setIsOtpSent(true)
      })

    // For the sake of this example, let's assume the OTP was sent successfully.
  }, [email])

  const verifyOtp = useCallback(() => {
    // Send an API request to your server to verify the OTP.
    fetch('/api/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ message, email }) => {
        alert(message)
        fetchWhoAmI(email)
      })
  }, [email, otp, fetchWhoAmI])

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!isOtpSent) {
        await sendOtp()
        setIsOtpSent(true)
      } else {
        await verifyOtp()
      }
    },
    [isOtpSent, sendOtp, verifyOtp],
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="vertical-card">
        <h2>Email + OTP Login</h2>
        <input
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={isOtpSent}
        />
        {!isOtpSent ? (
          <button type="submit">Send OTP</button>
        ) : (
          <>
            <input
              type="tel"
              maxLength={6}
              required
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit">Verify OTP</button>
          </>
        )}
      </div>
    </form>
  )
}

export default EmailOtpLogin
