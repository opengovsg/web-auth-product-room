const router = require('express').Router()
const {
  generateSalt,
  hashWithSaltManyTimes,
  areHashesSame,
} = require('../helper')

const { createPwUser, getPwUser } = require('../db')

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log({ username, password })

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' })
  }

  if (await getPwUser(username)) {
    return res.status(400).json({ message: 'User already exists' })
  }
  // **** START CODE HERE ****

  // Step 1: Generate salt
  const salt = generateSalt()

  // Step 2: Hash the password using helper function with salt
  const passwordHash = hashWithSaltManyTimes(password, salt)

  // Step 3: Store the username, hash and salt
  // Hint: use `await createPwUser(username, passwordHash, salt)` to store the user
  await createPwUser(username, passwordHash, salt)

  // **** END CODE HERE ****
  return res.json({ message: 'User registered successfully!' })
})

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' })
  }

  // Look for user in the database
  const userfound = await getPwUser(username)

  // If user is not found, return an error
  if (!userfound) {
    return res.status(401).json({ message: 'User not found' })
  }

  const { passwordHash, salt } = userfound
  console.log({ username, password, passwordHash, salt })

  // **** START CODE HERE ****

  // Step 1: Hash the password using helper function with salt
  // Hint: use `salt` to get the stored salt
  const newPasswordHash = hashWithSaltManyTimes(password, salt)

  // Step 2: Compare the stored hashed password with the provided password
  // Hint: use `passwordHash` to get stored password hash

  if (!areHashesSame(newPasswordHash, passwordHash)) {
    return res
      .status(401)
      .json({ message: 'Wrong password! Please try again!' })
  }

  // **** END CODE HERE ****

  // Success!
  return res.json({ message: 'Successfully logged in!' })
})

module.exports = router
