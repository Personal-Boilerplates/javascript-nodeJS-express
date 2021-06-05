import jwt from "jsonwebtoken";

import User from "../models/User.js";
import authConfig from "../../config/auth.js";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: { include: ["password"] }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "password does not match" });
    }

    const { id } = user;

    delete user.dataValues.password;

    return res.json({
      user,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
