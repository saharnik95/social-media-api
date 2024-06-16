const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute=require("./routes/users")
const authRoute=require("./routes/auth")
const postRoute=require("./routes/posts")
const multer=require("multer")
const path=require("path")
const cors = require("cors");


app.use(cors({
  origin: 'http://localhost:3000', // Update with your frontend URL
  credentials: true
}));

dotenv.config();

app.use("/images", express.static(path.join(__dirname, "public/images")));

  //middleware
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });
  app.use("/api/users",userRoute);
  app.use("/api/auth",authRoute);
  app.use("/api/posts",postRoute);


// Async function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.URL, {  });
    console.log("CONNECTED TO DATABASE SUCCESSFULLY");
  } catch (error) {
    console.error('COULD NOT CONNECT TO DATABASE:', error.message);
  }
};



// Call the function to connect to the database
connectToDatabase()
  .then(() => {
    // Start the Express server
    app.listen(8800, () => {
      console.log("Backend server is running");
    });
  });




