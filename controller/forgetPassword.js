// When a user requests password reset, this file store it in the database and email a reset link.

const { v4: uuidv4 } = require("uuid");
const {User,ForgotPasswordRequest} = require("../models/centralized");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
const bcrypt = require("bcrypt");

module.exports = {
    sendEmail :  async (req, res) =>{
          try {
      const { email } = req.body; // Extract user email
      console.log(email);

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const user = await User.findOne({ where: { email : email } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const resetId = uuidv4();

    // Store reset request in DB
    await ForgotPasswordRequest.create({
      id: resetId,
      user_id: user.id,
    });

     // Send email using SendInBlue
    const client = Sib.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SECRET_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const sender = {
      email: "bkumar221b@gmail.com",
      name: "Reset Password",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "SendInBlue integration successful",
      textContent: `Click the link to reset your password: http://localhost:3000/password/resetpassword/${resetId}`,
    });
    res.status(200).json({ message: "Reset email sent successfully!" });

  } catch (err) {
    console.error("SendInBlue integration unsuccessful:", err);
    return res.status(500).json({ message: "Failed to send email." });
  }
},


// reset form by taking uuid from url
  getResetForm : async (req, res) => {
    try {
      const { id } = req.params; // Extract UUID from URL
       console.log(id);
      const resetRequest = await ForgotPasswordRequest.findOne({
        where: { id, isActive: true },
      });
  
      if (!resetRequest) {
        return res.status(400).json({ message: "Invalid or expired link!" });
      }
  
      res.send(`
        <form action="/password/updatepassword/${id}" method="POST">
          <label>New Password:</label>
          <input type="password" name="password" required />
          <button type="submit">Update Password</button>
        </form>
      `);
    } catch (err) {
      console.error("Error getting reset form:", err);
      res.status(500).json({ message: "Server error!" });
    }
  },

  updatePassword : async (req, res) => {
    try {
      const { id } = req.params; // Reset request UUID
      const { password } = req.body;
  
      const resetRequest = await ForgotPasswordRequest.findOne({
        where: { id, isActive: true },
      });
  
      if (!resetRequest) {
        return res.status(400).json({ message: "Invalid or expired link!" });
      }
  
      // Hashing new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Updateing user password
      await User.update({ password: hashedPassword }, { where: { id: resetRequest.user_id } });
  
      // Marking reset request as used(false)
      await ForgotPasswordRequest.update({ isActive: false }, { where: { id } });
  
      res.send("Password updated successfully! You can now log in.");
    } catch (err) {
      console.error("Error updating password:", err);
      res.status(500).json({ message: "Failed to update password." });
    }
},
}