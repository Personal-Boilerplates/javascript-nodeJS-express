import Sequelize from "sequelize";
import mongoose from "mongoose";

import User from "../app/models/User.js";
import databaseConfig from "../config/database.js";

const models = [User]; //Sequelize

class Database {
  constructor() {
    this.init(); // Sequelize
    this.mongo(); // Mongoose
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection =
      process.env.MONGO_URL &&
      mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      });
  }
}

export default new Database();
