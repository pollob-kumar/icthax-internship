const mongoose = require("mongoose"); // mongoose import korlo

// Data-r structure (blueprint) define korlo
const userSchema = new mongoose.Schema({
  name: {
    // name field er rules shuru
    type: String, // shudhu text rakha jabe
    required: true, // ei field chara save kora jabe na
  },
  email: {
    // email field er rules shuru
    type: String, // shudhu text rakha jabe
    required: true, // ei field chara save kora jabe na
    unique: true, // eki email diye duijon thakte parbe na
  },
  age: {
    // age field er rules shuru
    type: Number, // shudhu number rakha jabe
    default: 18, // na dile default value boshbe
  },
});

// Schema theke Model toiri korlo, collection name hobe "users"
const User = mongoose.model("User", userSchema);

// Model export korlo
module.exports = User;
