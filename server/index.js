const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

// MongoDB connection URI
const uri = "mongodb://localhost:27017";
const port = 5000;

const app = express();
const locationRoutes = require('./routes/location');
app.use('/api/location', locationRoutes);
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const client = new MongoClient(uri);

// Password generator function
function generateRandomPassword(length = 10) {
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const allChars = upperCaseChars + lowerCaseChars;
  let password = "";
  for (let i = 0; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  return password;
}


function isResetAllowed(lastResetRequest) {
  if (!lastResetRequest) return true;

  const lastRequestDate = new Date(lastResetRequest);
  if (isNaN(lastRequestDate)) {
      throw new Error("Invalid date provided for lastResetRequest.");
  }

  const now = new Date();

  // Check if the reset request was on the same calendar day
  return (
      lastRequestDate.getFullYear() !== now.getFullYear() ||
      lastRequestDate.getMonth() !== now.getMonth() ||
      lastRequestDate.getDate() !== now.getDate()
  );
} 

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
      user: "aditi18604@gmail.com", 
      pass: "xtvk vthd oqib ehxu", 
  },
});

async function run() {
  try {
    await client.connect();
    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");

    // Registration endpoint
    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await usercollection.insertOne(user);
      res.send(result);
    });

    // Get logged-in user details
    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.find({ email: email }).toArray();
      res.send(user);
    });

    // Add a new post
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postcollection.insertOne(post);
      res.send(result);
    });

    // Get all posts
    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      res.send(post);
    });

    // Get posts by a specific user
    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postcollection.find({ email: email }).toArray()
      ).reverse();
      res.send(post);
    });

    // Get all users
    app.get("/user", async (req, res) => {
      const user = await usercollection.find().toArray();
      res.send(user);
    });

    // Update user profile
    app.patch("/userupdate/:email", async (req, res) => {
      const filter = { email: req.params.email };
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await usercollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.post("/forgot-password", async (req, res) => {
      const { emailOrPhone } = req.body;
  
      try {
          // Find user by email
          const user = await usercollection.findOne({ email: emailOrPhone });
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }
  
          if (!isResetAllowed(user.lastResetRequest)) {
              return res
                  .status(429)
                  .json({ message: "You can request password reset only once a day." });
          }
  
          const newPassword = generateRandomPassword();
          const filter = { email: emailOrPhone };
          const updateDoc = {
              $set: { password: newPassword, lastResetRequest: new Date().toISOString() },
          };
          await usercollection.updateOne(filter, updateDoc);
  
          // Send the new password via email using Nodemailer
          const mailOptions = {
              from: "aditi18604@gmail.com", // Sender address
              to: emailOrPhone, // Receiver address
              subject: "Password Reset Request",
              text: `Hi ${user.name},\n\nYour new password is: ${newPassword}\n\nPlease log in and change it as soon as possible.`,
          };
  
          await transporter.sendMail(mailOptions);
  
          console.log(`Password reset email sent to ${emailOrPhone}`);
          res.status(200).json({
              message: "Password reset successfully. Please check your email.",
          });
      } catch (error) {
          console.error("Error during password reset:", error);
          res.status(500).json({ message: "An error occurred while resetting the password." });
      }
  });

  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Twiller clone is working");
});

app.listen(port, () => {
  console.log(`Twiller clone is working on ${port}`);
});