// const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
// const User = require('../models/User');
// const Log = require('../models/TransactionLog');

// // const register = async (req, res) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

// //   const { username, password, role, email } = req.body;
// //   let user = await User.findOne({ username });
// //   if (user) return res.status(400).json({ message: 'User exists' });

// //   user = new User({ username, password, role, email });
// //   await user.save();

// //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //   await new Log({ action: 'user_register', user: user._id, details: { role } }).save();

// //   res.json({ token });
// // };

// // const login = async (req, res) => {
// //   const { username, password } = req.body;
// //   const user = await User.findOne({ username });
// //   if (!user || !(await user.comparePassword(password))) {
// //     return res.status(401).json({ message: 'Invalid credentials' });
// //   }

// //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //   await new Log({ action: 'user_login', user: user._id }).save();

// //   res.json({ token });
// // };




// const register = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { username, password, role, email } = req.body;
//   let user = await User.findOne({ username });
//   if (user) return res.status(400).json({ message: 'User already exists' });

//   user = new User({ username, password, role, email });
//   await user.save();

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   await new Log({ action: 'user_register', user: user._id, details: { role } }).save();

//   res.json({
//     message: 'Registration successful',
//     token,
//     user: { id: user._id, username: user.username, role: user.role, email: user.email }
//   });
// };

// const login = async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (!user || !(await user.comparePassword(password))) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   await new Log({ action: 'user_login', user: user._id }).save();

//   res.json({
//     message: 'Login successful',
//     token,
//     user: { id: user._id, username: user.username, role: user.role, email: user.email }
//   });
// };



// const getProfile = async (req, res) => {
//   res.json(req.user);
// };

// const updateProfile = async (req, res) => {
//   const { email } = req.body;
//   req.user.email = email;
//   await req.user.save();
//   res.json(req.user);
// };

// const assignRole = async (req, res) => {
//   const { userId, role } = req.body;
//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: 'User not found' });
//   user.role = role;
//   await user.save();
//   await new Log({ action: 'role_assign', user: req.user._id, details: { assignedTo: userId, role } }).save();
//   res.json(user);
// };

// const logout = async (req, res) => {
//   // JWT is stateless, so just client-side token removal. Log for audit.
//   await new Log({ action: 'user_logout', user: req.user._id }).save();
//   res.json({ message: 'Logged out' });
// };

// module.exports = { register, login, getProfile, updateProfile, assignRole, logout };



//------------
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Log = require('../models/TransactionLog');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password, role, email } = req.body;
  let user = await User.findOne({ username });
  if (user) return res.status(400).json({ message: 'User already exists' });

  user = new User({ username, password, role, email });
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  await new Log({ action: 'user_register', user: user._id, details: { role } }).save();

  res.json({
    message: 'Registration successful',
    token,
    user: { id: user._id, username: user.username, role: user.role, email: user.email }
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  await new Log({ action: 'user_login', user: user._id }).save();

  res.json({
    message: 'Login successful',
    token,
    user: { id: user._id, username: user.username, role: user.role, email: user.email }
  });
};




const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  const { email } = req.body;
  req.user.email = email;
  await req.user.save();
  res.json(req.user);
};

const assignRole = async (req, res) => {
  const { userId, role } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  await new Log({ action: 'role_assign', user: req.user._id, details: { assignedTo: userId, role } }).save();
  res.json(user);
};

const logout = async (req, res) => {
  await new Log({ action: 'user_logout', user: req.user._id }).save();
  res.json({ message: 'Logged out' });
};

module.exports = { register, login, getProfile, updateProfile, assignRole, logout };