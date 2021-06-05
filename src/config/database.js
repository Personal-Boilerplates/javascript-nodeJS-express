/* Escolha o banco, instale e altere o dialect:

----PostgreSQL-------
yarn add pg pg-hstore
dialect: "postgres"

----MySQL----------
yarn add mysql2
dialect: "mysql"

----MariaDB--------
yarn add mariadb
dialect: "mariadb"

----SQLite---------
yarn add sqlite3
dialect: "sqlite"

----MSSQL----------
yarn add tedious
dialect: "mssql"
*/

const databaseConfig = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }

  // dialectOptions: {connectTimeout: 1000}, // options for MariaDb

  // dialectOptions: { // options for MSSQL
  //   options: {
  //     useUTC: false,
  //     dateFirst: 1,
  //   }
  // }

  // storage: 'path/to/database.sqlite', // storage for SQLite
};

export default databaseConfig;
