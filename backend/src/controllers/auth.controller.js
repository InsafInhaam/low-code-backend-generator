import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || "user" },
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error logging in" });
  }
};
