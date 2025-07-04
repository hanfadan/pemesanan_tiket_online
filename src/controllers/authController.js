const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dataPath = path.join(__dirname, '../data/users.json');

let users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function saveUsers() {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

// POST /api/register
exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }
  const hash = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    email,
    password: hash,
    name,
    role: 'user'
  };
  users.push(newUser);
  saveUsers();
  res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name });
};

// POST /api/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

// POST /api/logout
// (dummy saja: client cukup buang token)
exports.logout = (req, res) => {
  res.status(204).end();
};
