const { deleteSession, getSession } = require('../db')

const router = require('express').Router()

router.post('/logout', async (req, res) => {
  const { sid } = req.cookies

  // Step 1: Delete session from database
  await deleteSession(sid)
  // Step 2: Clear cookie
  res.clearCookie('sid')
  return res.json({ message: 'Logged out successfully' })
})

// Login route
router.get('/whoami', async (req, res) => {
  // Step 1: Get sid from cookie
  const { sid } = req.cookies

  // Step 2: Look for session in the database
  const session = await getSession(sid)

  // Step 3: If session is not found, send empty json
  if (!session) {
    return res.json({})
  }

  // Step 4: If session is found, return the data
  return res.json(session.data)
})

module.exports = router
