import User from "../models/User.js";

class UserController {
  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }

  async show(req, res) {
    const user = await User.findByPk(req.userId);

    return res.json(user);
  }

  async store(req, res) {
    const user = await User.create(req.body);

    return res.json(user);
  }

  async update(req, res) {
    const userUpdated = await User.findByIdAndUpdate(req.userId, req.body);

    return res.json(userUpdated);
  }

  async destroy(req, res) {
    const user = await User.destroy({
      where: { id: req.userId },
      errorMessage: {
        sucess: "Usuário removido",
        fail: "Falha na remoção, tente novamente"
      }
    });

    return res.json(user);
  }
}

export default new UserController();
