const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const { DBConnection } = require("./database/db");

//DB connection 
DBConnection();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sample route
app.get("/", (req, res) => {
  res.send("Welcome");
});

//Routes
app.use("/auth", authRoutes);
app.use("/images", imageRoutes);

// Server 
app.listen(8080, () => {
  console.log("Server is listining on port 8080!");
});
