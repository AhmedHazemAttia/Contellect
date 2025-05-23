import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = 'your_jwt_secret';

const USERS:any = {
  user1: { password: 'user1', role: 'admin' },
  user2: { password: 'user2', role: 'viewer' },
};

router.post('/login', (req:any, res:any) => {
  const { username, password } = req.body;

   const user = USERS[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, role: user.role },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Login successful', token });
});

export default router;
