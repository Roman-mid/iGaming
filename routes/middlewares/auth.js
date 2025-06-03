// middlewares/auth.js
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'your_jwt_secret_key'; // just for test

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Missing or invalid token' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded; // теперь req.user.email доступен в любом роуте
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// for coocies
// const authMiddleware = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// for sessions
function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ result: false, message: 'Unauthorized' });
    // return res.redirect('/login');
  }
  next();
}

module.exports = authMiddleware;

// Если хочешь — покажу, как хранить сессии не в памяти, а в Redis или базе данных (для продакшна это важно).
