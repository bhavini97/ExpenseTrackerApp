require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, db } = require("../models/centralized");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * Register a new user
 */
async function addUser(username, email, password) {
  if (!username || !email || !password) {
    throw new Error("All fields required");
  }

  const t = await db.transaction();
  try {
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user only if the email doesn't exist
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { username, password: hashedPassword, email },
      transaction: t,
    });

    if (!created) {
      throw new Error("User already exists with the same email");
    }

    await t.commit();
    return user;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * Login an existing user
 */
async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("All fields required");
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  // Verify password
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid password");
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, SECRET_KEY);
  return { token, userId: user.id };
}

module.exports = { addUser, loginUser };
