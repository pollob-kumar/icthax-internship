const User = require("../models/User"); // User Model import korlo

// POST /users er jonno logic
const createUser = async (req, res) => {
  // async karon database er kaje shomoy lage
  try {
    // kono vul hole catch e dhorar jonno cheshta korlo
    const newUser = await User.create({
      // await diye data save howa porjonto opekkha korlo
      name: req.body.name, // body theke name nilo
      email: req.body.email, // body theke email nilo
      age: req.body.age, // body theke age nilo
    });
    res.status(201).json(newUser); // 201 mane "Created", notun data ferot pathalo
  } catch (error) {
    // kono vul hole ekhane dhora porbe
    res.status(400).json({ error: error.message }); // validation error hole ekhane dhora porbe
  }
};

// GET /users er jonno logic
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // kono condition chara shob document anlo
    res.status(200).json(users); // 200 status shoho shob user ferot pathalo
  } catch (error) {
    res.status(500).json({ error: error.message }); // server error hole ei message pathalo
  }
};

// GET /users/:id er jonno logic
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // nirdishto _id diye document khujlo
    if (!user) {
      // user khuje na pele
      return res.status(404).json({ error: "User not found" }); // pawa na gele null ashe
    }
    res.status(200).json(user); // 200 status shoho user ferot pathalo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /users/:id er jonno logic
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, // kon user update hobe
      req.body, // ki ki field bodlabe
      { new: true, runValidators: true }, // new: update er porer data ferot dao, runValidators: update er shomoy o validation chalao
    );
    if (!updatedUser) {
      // user khuje na pele
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser); // 200 status shoho update howa user ferot pathalo
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /users/:id er jonno logic
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // khuje muche phello
    if (!deletedUser) {
      // user khuje na pele
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" }); // muche phellar confirmation message pathalo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // shob function eksathe export korlo
  createUser, // createUser function jog korlo
  getAllUsers, // getAllUsers function jog korlo
  getUserById, // getUserById function jog korlo
  updateUser, // updateUser function jog korlo
  deleteUser, // deleteUser function jog korlo
};
