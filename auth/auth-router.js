const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../user/user-model.js');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets.js');

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  // n = 10
  // 2^10 salt rounds mean to "cost factor"
  // the cost factor is essentially how much time is needed to calculate a single bcrpyt hash
  // the higher the cost factor, the more hashing rounds are done, increase the cost factor by double the nessaray time for every increase by 1
  // more time spent hashing it, more difficult it is for the password to be created

  // password: orange => frenggkjb2131ws
  // 1. hashing process of converting a given key into another value
  // 2. salting (both manual & automatic) - is a unique value that can be added to the end of a password to create a different hash value
  // 3. accumlative hashing rounds
  user.password = hash;
  Users.add(user)
  .then((saved) => {
    res.status(201).json(saved)
  })
  .catch((error) => {
    res.status(500).json(error);
  })
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;
  Users.findBy({ username })
  .first()
  .then((user) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user); // get a token
      res.status(200).json({
         message: `Welcome ${user.username}`, 
         token, // send the token
        })
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  })
  .catch ((error) => {
    res.status(500).json(error);
  })
});

function generateToken(user){
  const payload = {
    subject: user.id,
    username: user.username,
    lat: Date.now()
  }
  const options = {
    expiresIn: '1h',
  }
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
