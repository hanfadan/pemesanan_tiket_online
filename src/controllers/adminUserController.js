const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/users.json');
let users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function saveUsers() {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

exports.getUsers = (req, res) => {
  const safe = users.map(u => {
    const { password, ...rest } = u;
    return rest;
  });
  res.json(safe);
};

exports.createUser = async (req, res) => {
  const { email, password, name, role } = req.body;
  // bisa tambahkan bcrypt hashing dsb.
  const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id: newId, email, password, name, role };
  users.push(newUser);
  saveUsers();
  const { password: pw, ...safe } = newUser;
  res.status(201).json(safe);
};

exports.updateUserRole = (req, res) => {
  const userId = +req.params.userId;
  const { role } = req.body;
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users[idx].role = role;
  saveUsers();
  const { password, ...safe } = users[idx];
  res.json(safe);
};
