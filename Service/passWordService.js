const { v4: uuidv4 } = require("uuid");
const { User, ForgotPasswordRequest } = require("../models/centralized");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");


require("dotenv").config();

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SECRET_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

async function sendResetEmail(email) {
    if (!email) throw new Error("Email is required!");
  
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found!");
  
    const resetId = uuidv4();
  
    await ForgotPasswordRequest.create({
      id: resetId,
      user_id: user.id,
    });
  
    const sender = { email: "bkumar221b@gmail.com", name: "Reset Password" };
    const receivers = [{ email }];

   // setting receiver and sender data and content of mail
    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Password Reset Request",
      textContent: `Click the link to reset your password: http://localhost:3000/password/resetpassword/${resetId}`,
    });
  
    return { message: "Reset email sent successfully!" };
  }
  
  /**
   * Retrieves the password reset form.// reset form by taking uuid from url
   */
  async function getResetForm(id) {
    const resetRequest = await ForgotPasswordRequest.findOne({
      where: { id, isActive: true },
    });
  // only move forward if token is not expired
    if (!resetRequest) throw new Error("Invalid or expired link!");
  
    return `
      <form action="/password/updatepassword/${id}" method="POST">
        <label>New Password:</label>
        <input type="password" name="password" required />
        <button type="submit">Update Password</button>
      </form>
    `;
  }
  
  /**
   * Updates the user's password. 
   */
  async function updatePassword(id, password) {
    const resetRequest = await ForgotPasswordRequest.findOne({
      where: { id, isActive: true },
    });
  
    if (!resetRequest) throw new Error("Invalid or expired link!");

  // Hashing new password
    const hashedPassword = await bcrypt.hash(password, 10);

  // Updateing user password
    await User.update({ password: hashedPassword }, { where: { id: resetRequest.user_id } });

    // Marking reset request as used(false)
    await ForgotPasswordRequest.update({ isActive: false }, { where: { id } });
  
    return { message: "Password updated successfully!" };
  }
  
  module.exports = { sendResetEmail, getResetForm, updatePassword };