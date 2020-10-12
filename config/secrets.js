module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'its a secret'
};

// algorithm(HS253) used to sign the JWT so that the secret can be used both
// encrypt and decrypt our key
// symmetric key
// secret key + header + payload = hash/token

/*

 header: {
    alg: "HS256",
    typ: JWT
}

  const payload = {
    subject: user.id,
    username: user.username,
    lat: Date.now()

*/