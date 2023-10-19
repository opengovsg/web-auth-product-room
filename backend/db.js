const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db.sqlite')

db.run(
  `CREATE TABLE IF NOT EXISTS users_pw (username TEXT PRIMARY KEY, passwordHash TEXT);
   CREATE TABLE IF NOT EXISTS users_otp (email TEXT PRIMARY KEY, otpHash TEXT, attempts INTEGER, lastSentAt INTEGER);
   CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, data TEXT, expiresAt INTEGER);`,
  (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Database initialized')
  },
)

async function createPwUser(email, hash, salt) {
  const passwordHash = `${hash}.${salt}`
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users_pw (username, passwordHash) VALUES (?, ?);',
      [email, passwordHash],
      (err) => {
        if (err) {
          return reject(err)
        }

        resolve()
      },
    )
  })
}

async function getPwUser(username) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users_pw WHERE username = ?;',
      [username],
      (err, row) => {
        if (err) {
          return reject(err)
        }
        if (row) {
          const [passwordHash, salt] = row.passwordHash.split('.')
          resolve({
            username: row.username,
            passwordHash,
            salt,
          })
        } else {
          resolve(undefined)
        }
      },
    )
  })
}

async function storeOtpHash(email, hash, salt) {
  const lastSentAt = Date.now()
  const saltedHash = `${hash}.${salt}`
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users_otp (email, otpHash, attempts, lastSentAt) VALUES (?, ?, 0, ?) 
      ON CONFLICT(email) DO UPDATE SET otpHash = ?, attempts = 0, lastSentAt = ?;`,
      [email, saltedHash, lastSentAt, saltedHash, lastSentAt],
      (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      },
    )
  })
}

async function getOtpUser(email) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users_otp WHERE email = ?;`, [email], (err, row) => {
      if (err) {
        return reject(err)
      }
      resolve(row)
    })
  })
}

async function incrementOtpAttempts(email) {
  return new Promise((resolve, reject) => {
    db.get(
      `UPDATE users_otp SET attempts = attempts + 1 WHERE email = ? RETURNING *;`,
      [email],
      (err, row) => {
        if (err) {
          return reject(err)
        }
        if (row) {
          const [hash, salt] = row.otpHash.split('.')
          resolve({
            username: row.username,
            otpHash: hash,
            salt,
            attempts: row.attempts,
            lastSentAt: row.lastSentAt,
          })
        } else {
          resolve(undefined)
        }
      },
    )
  })
}

async function resetOtpHash(email) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users_otp SET otpHash = NULL, attempts = 0, lastSentAt = NULL WHERE email = ?;`,
      [email],
      (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      },
    )
  })
}

async function storeSession(sid, data, expiresAt) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO sessions (sid, data, expiresAt) VALUES (?, ?, ?);`,
      [sid, JSON.stringify(data), expiresAt],
      (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      },
    )
  })
}

async function getSession(sid) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM sessions WHERE sid = ?;`, [sid], (err, row) => {
      if (err) {
        return reject(err)
      }
      if (row) {
        resolve({
          sid: row.sid,
          data: JSON.parse(row.data),
          expiresAt: row.expiresAt,
        })
      } else {
        resolve(undefined)
      }
    })
  })
}

async function deleteSession(sid) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM sessions WHERE sid = ?;`, [sid], (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

module.exports = {
  createPwUser,
  getPwUser,
  storeOtpHash,
  getOtpUser,
  incrementOtpAttempts,
  resetOtpHash,
  storeSession,
  getSession,
  deleteSession,
}
