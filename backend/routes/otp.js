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

  // Step 2: Generate salt

  // Step 3: Hash the otp using helper function with salt

  // Step 4: Store the hash (also automatically reset attempts and set lastSentAt to now)
  // Usage hint: await storeOtpHash(email, otpHash, salt)

  // Step 5: Send email (just console log it now)
  // await sendOtpEmail(email, otp)

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
  // Hint: current attemopts is `storedUser.attempts`

  // if (attepts are more than 5) {
  //   return res.status(401).json({ message: 'Too many attempts' })
  // }

  // Step 3: Check if otp is still valid (lastSentAt is less than 1 min ago)
  // Hint: otp sent timestamp is `storedUser.lastSentAt`, current timestamp is `Date.now()` in milliseconds

  // if (otp has expired) {
  //   return res.status(401).json({ message: 'OTP expired' })
  // }

  // Step 4: Hash the provided otp using helper function with salt

  // Step 5: Compare the stored hashed otp with the hash of the provided otp
  // Hint: stored hash is `storedUser.otpHash`

  // if (otp doesnt match) {
  //   return res.json({ message: 'Wrong OTP. Please try again.' })
  // }

  // Step 6: Reset attempts and lastSentAt

  // **** TUTORIAL 2: END CODE HERE ****

  // **** TUTORIAL 3: START CODE HERE ****

  // Create session data
  const sessionData = { email, loggedInAt: Date.now() }

  // Step 1: Create session id with crypto.randomUUID()

  // Step 2: Calculate expiry timestamp (30 mins from now)

  // Step 3: Store session in session table

  // set cookie
  // res.cookie('sid', sid, {
  //   secure: false, // set to true only if your using https
  //   httpOnly: true, // prevent client JS from reading cookie
  //   expires: <EXPIRY_TIMESTAMP></EXPIRY_TIMESTAMP>, // expiry timestamp
  //   sameSite: 'strict', // prevent CSRF
  // })

  // **** TUTORIAL 3: END CODE HERE ****

  return res.json({ message: 'Logged in successfully' })
})

module.exports = router
