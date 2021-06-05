module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      // associationExample: {
      //   type: Sequelize.INTEGER,
      //   references: { model: "tablename", key: "id" },
      //   onUpdate: "CASCADE",
      //   onDelete: "SET NULL",
      //   allowNull: true
      // },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nascimento: {
        type: Sequelize.DATE,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING
      },
      token_created_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
