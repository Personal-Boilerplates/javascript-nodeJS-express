export const beforeDefine = async (instance, options) => {
  const dataTypes = options.sequelize.Sequelize;
  const tableName = options.tableName;

  if (tableName !== "SequelizeMetum" && tableName !== "SequelizeMeta" && !tableName.includes("VW_")) {
    instance.cod = {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: `${tableName}_COD`,
    };
    if (tableName !== "REG" && tableName !== "EST" && tableName !== "CID" && tableName !== "BAI") {
      instance.status = {
        type: dataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: `${tableName}_STATUS`,
      };
      instance.createdAtDate = {
        type: dataTypes.DATEONLY,
        field: `${tableName}_DTCAD`,
      };
      instance.createdAtHour = {
        type: dataTypes.TIME,
        field: `${tableName}_HRCAD`,
      };
      instance.createdByUserCod = {
        type: dataTypes.INTEGER,
        field: `${tableName}_USUCAD`,
      };
      instance.deletedAtDate = {
        type: dataTypes.DATE,
        field: `${tableName}_DTDEL`,
      };
    }
  }
};
