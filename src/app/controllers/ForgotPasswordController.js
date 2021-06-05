import User from "../models/User.js";
import crypto from "crypto";
import Mail from "../../lib/Mail.js";
import moment from "moment";

class ForgotPasswordController {
  async store(req, res) {
    const { email } = req.body;

    const token = crypto.randomBytes(10).toString("hex");

    const token_created_at = new Date();

    const user = await User.findOne({ where: { email } });

    if (user) {
      await user.update({ token, token_created_at });

      await Mail.sendMail({
        to: `${user.name} <${user.email}>`,
        subject: "Recuperação de senha",
        template: "forgotPassword",
        context: {
          user: user.name,
          token: token,
          link: `${process.env.APP_URL}/passwords/?id=${user.id}&token=${token}`
        }
      });

      return res.json({
        message: "Foi enviado um email para recuperação da senha"
      });
    }

    return res.json({ message: "Não foi possível encontrar o email" });
  }

  async update(req, res) {
    const { token, email, password } = req.body;

    const user = await User.findOne({
      where: { token, email },
      attributes: {
        include: ["password", "token", "token_created_at", "updatedAt"]
      }
    });

    if (user && password) {
      const checkExpiration = moment().diff(user["token_created_at"], "hours");

      if (user.token !== null && checkExpiration < 24) {
        await user.update({ password: password, token: null });

        user.returnAttributes({
          exclude: ["password", "token", "token_created_at", "updatedAt"]
        });

        return res.json(user);
      }
    }

    return res.json({ message: "Token ou Email inválido" });
  }
}

export default new ForgotPasswordController();
