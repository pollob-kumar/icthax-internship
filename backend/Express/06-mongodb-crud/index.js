require("dotenv").config(); // .env file load korlo
const express = require("express"); // express import korlo
const mongoose = require("mongoose"); // mongoose import korlo
const userRoutes = require("./routes/userRoutes"); // routes import korlo
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express(); // app object banalo
const port = process.env.PORT || 3000; // .env theke PORT nilo

app.use(express.json()); // JSON body porar middleware chalu korlo

mongoose
  .connect(process.env.MONGO_URI) // MongoDB er sathe connect korar cheshta korlo
  .then(() => {
    console.log("MongoDB connected successfully!"); // connect shofol hole ei message
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err); // connect bartho hole ei message
  });

app.use("/", userRoutes); // userRoutes er shob route jukto korlo
app.use("/", studentRoutes);
app.use("/", teacherRoutes);
app.use("/", employeeRoutes);
app.use("/", courseRoutes);

app.listen(port, () => {
  // nirdishto port-e server chalu korlo
  console.log(`Server is running on http://localhost:${port}`); // server chalu howar barta dekhalo
});
