const { users } = require("../models/BookModels");

// index methods
exports.indexUser = (req, res) => {
  res.json(users);
};

//create a new user
exports.createUser = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const newUser = { id: Date.now().toString(), name, email, password };
  users.push(newUser);
  res.status(201).json(newUser);
  console.log("New user added:", newUser);
};

//update user
exports.showUser = (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json(user);
  console.log("User show:", user);
};

//update user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  if (
    email &&
    users.some(
      (existingUser) => existingUser.email === email && existingUser.id !== id
    )
  ) {
    return res.status(400).json({ message: "Email already exists." });
  }
  user.name = name || user.name;
  user.email = email || user.email;
  user.password = password || user.password;
  res.json(user);
  console.log("User updated:", user);
};

//delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "User not found." });
  }
  const deletedUser = users.splice(index, 1)[0];
  res.json(deletedUser);
  console.log("User deleted:", deletedUser);
};
