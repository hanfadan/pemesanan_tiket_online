const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/users.json');

let users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function saveUsers() {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

// middleware untuk auth
exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing' });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// middleware untuk cek role admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

// GET /api/user
exports.getProfile = (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = user;
  res.json(safe);
};

// PUT /api/user
exports.updateProfile = (req, res) => {
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  const { name, email } = req.body;
  users[idx] = { ...users[idx], name: name || users[idx].name, email: email || users[idx].email };
  saveUsers();
  const { password, ...safe } = users[idx];
  res.json(safe);
};
