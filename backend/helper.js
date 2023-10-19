require('dotenv').config()
const axios = require('axios')
const { scryptSync, randomBytes, timingSafeEqual } = require('crypto')

function generateSalt() {
  return randomBytes(16).toString('hex')
}

function hashWithSaltManyTimes(secret, salt) {
  return scryptSync(secret, salt, 32).toString('hex')
}

function areHashesSame(hash1, hash2) {
  return timingSafeEqual(Buffer.from(hash1), Buffer.from(hash2))
}

async function sendOtpEmail(email, otp) {
  const postmanApiKey = process.env.POSTMAN_API_KEY
  if (!postmanApiKey) {
    return console.log(`OTP ${otp} sent to ${email}`)
  } else {
    return axios.post(
      'https://api.postman.gov.sg/v1/transactional/email/send',
      {
        subject: 'Your OTP',
        body: `Your OTP is ${otp}`,
        recipient: email,
        from: 'Myself <donotreply@mail.postman.gov.sg>',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.POSTMAN_API_KEY}`,
        },
      },
    )
  }
}

module.exports = {
  generateSalt,
  hashWithSaltManyTimes,
  areHashesSame,
  sendOtpEmail,
}
