const router = require('express').Router()
const { customAlphabet } = require('nanoid')
const { randomUUID } = require('crypto')

const {
  generateSalt,
  hashWithSaltManyTimes,
  areHashesSame,
  sendOtpEmail,
} = require('../helper')
const {
  storeOtpHash,
  getOtpUser,
  incrementOtpAttempts,
  resetOtpHash,
  storeSession,
} = require('../db')

const OTP_ALLOWED_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const OTP_LENGTH = 6
const generateOtp = customAlphabet(OTP_ALLOWED_CHARS, OTP_LENGTH)

router.post('/request', async (req, res) => {
  const { email } = req.body

  // (bonus) check if lastSentAt is more than 1 minute ago

  // **** START CODE HERE ****
  // Step 1: Generate a random 6-character alphanumeric OTP
  const otp = generateOtp()

  // Step 2: Generate salt
  const salt = generateSalt()

  // Step 3: Hash the otp using helper function with salt
  const otpHash = hashWithSaltManyTimes(otp, salt)

  // Step 4: Store the hash (also automatically reset attempts and set lastSentAt to now)
  // Usage hint: await storeOtpHash(email, otpHash, salt)
  await storeOtpHash(email, otpHash, salt)

  // Step 5: Send email (just console log it now)
  await sendOtpEmail(email, otp)

  // **** END CODE HERE ****
  return res.json({ message: 'User created' })
})

// Login route
router.post('/verify', async (req, res) => {
  const { email, otp } = req.body
  // Look for user in the database
  const userfound = await getOtpUser(email)

  // If user is not found, return an error
  if (!userfound || !userfound.otpHash) {
    return res.status(400).json({ message: 'OTP not sent' })
  }

  // **** TUTORIAL 2: START CODE HERE ****
  // Step 1: increment attempts
  const storedUser = await incrementOtpAttempts(email)

  // Step 2: Check if attempts is more than 5
  // Hint: current attempts is `storedUser.attempts`

  if (storedUser.attempts > 5) {
    return res.status(401).json({ message: 'Too many attempts' })
  }

  // Step 3: Check if otp is still valid (lastSentAt is less than 1 min ago)
  // Hint: otp sent timestamp is `storedUser.lastSentAt`, current timestamp is `Date.now()` in milliseconds

  if (Date.now() - storedUser.lastSentAt > 60 * 1000) {
    return res.status(401).json({ message: 'OTP expired' })
  }

  // Step 4: Hash the provided otp using helper function with salt
  const newOtpHash = hashWithSaltManyTimes(otp, storedUser.salt)

  // Step 5: Compare the stored hashed otp with the hash of the provided otp
  // Hint: stored hash is `storedUser.otpHash`

  if (!areHashesSame(newOtpHash, storedUser.otpHash)) {
    return res.status(401).json({ message: 'Wrong OTP. Please try again.' })
  }

  // Step 6: Reset attempts and lastSentAt
  await resetOtpHash(email)

  // **** TUTORIAL 2: END CODE HERE ****

  // **** TUTORIAL 3: START CODE HERE ****

  // Create session data
  const sessionData = { email, loggedInAt: Date.now() }

  // Step 1: Create session id with crypto.randomUUID()
  const sid = randomUUID()
  // Step 2: Calculate expiry timestamp (30 mins from now)
  const expiresAt = Date.now() + 30 * 60 * 1000

  // Step 3: Store session in session table
  // hint: await storeSession(sid, sessionData, expiresAt)
  await storeSession(sid, sessionData, expiresAt)

  // set cookie
  res.cookie('sid', sid, {
    secure: false, // set to true only if your using https
    httpOnly: true, // prevent client JS from reading cookie
    expires: new Date(expiresAt),
    sameSite: 'strict', // prevent CSRF
  })

  // **** TUTORIAL 3: END CODE HERE ****

  return res.json({ message: 'Logged in successfully' })
})

module.exports = router
