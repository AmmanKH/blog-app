
// JWT utility functions for token generation and verification
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
function createTokenForUser(user) {
  // Create a JWT token for the user
//   return jwt.sign(
//     {
//       id: user._id,
//       email: user.email,
//       role: user.role,
//     },
//     JWT_SECRET,
//     { expiresIn: '1h' } // Token expires in 1 hour
//   );
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, JWT_SECRET);
    return token;
}
function verifyToken(token) {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
}

module.exports = {
  createTokenForUser,
  verifyToken,
};