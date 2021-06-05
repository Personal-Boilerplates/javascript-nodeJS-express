import Sequelize from "sequelize";
import Model from "./customModel/Model.js";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            args: true,
            msg: "O username já está em uso"
          },
          validate: {
            notNull: {
              msg: "O username não pode ser nulo"
            },
            notEmpty: {
              msg: "O username não pode ser vazio"
            }
          }
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            args: true,
            msg: "O email já está em uso"
          },
          validate: {
            notNull: {
              msg: "Email não pode ser nulo"
            },
            notEmpty: {
              msg: "O email não pode ser vazio"
            },
            isEmail: {
              msg: "Escreva um email válido"
            }
          }
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "A senha não pode ser nula"
            },
            notEmpty: {
              msg: "A senha não pode ser vazia"
            }
          }
        },
        nascimento: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            isDate: {
              msg: "Insira uma data"
            },
            isBefore: {
              args: String(new Date()),
              msg: "Insira uma data válida"
            },
            notNull: {
              msg: "A data de nascimento não pode ser nula"
            },
            notEmpty: {
              msg: "A data de nascimento não pode ser vazia"
            }
          }
        },
        token: Sequelize.STRING,
        token_created_at: Sequelize.DATE
      },
      {
        sequelize,
        hooks: {
          beforeSave: async user => {
            if (user.password) {
              user.password = await bcrypt.hash(user.password, 8);
            }
          }
        }
      }
    );
    return this;
  }

  // static associate(models) {
  //   this.belongsTo(models.ModelNameExampe, { foreignKey: "attributeExample" });
  // }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

export default User;
