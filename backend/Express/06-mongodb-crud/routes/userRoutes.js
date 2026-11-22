const express = require("express"); // express import korlo
const router = express.Router(); // Router object banalo
const userController = require("../controllers/userController"); // controller import korlo

router.post("/users", userController.createUser); // Create
router.get("/users", userController.getAllUsers); // Read All
router.get("/users/:id", userController.getUserById); // Read One
router.put("/users/:id", userController.updateUser); // Update
router.delete("/users/:id", userController.deleteUser); // Delete

module.exports = router; // router export korlo
