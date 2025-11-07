import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
export const loginUser = async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await userModel.findOne({ Username: username });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
export const registerUser = async (req, res) => {
    try {

        const { Username, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ Username });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
       // if (!validator.isEmail(email)) {
       //     return res.json({ success: false, message: "Please enter a valid email" })
       // }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            username: Username,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
//import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Body email:", `"${email}"`);
    console.log("Body password:", `"${password}"`);

    // Trim to avoid whitespace issues
    if (email?.trim() === process.env.ADMIN_EMAIL?.trim() &&
        password?.trim() === process.env.ADMIN_PASSWORD?.trim()) {

      // ✅ Use object payload instead of string
      const token = jwt.sign(
        { email: email.trim() },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ success: true, token });

    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



//export default { loginUser, registerUser, adminLogin }