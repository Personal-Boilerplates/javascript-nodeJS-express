export const beforeCreate = (instance, options) => {
  const tableName = instance.constructor.tableName;
  if (
    tableName !== "REG" &&
    tableName !== "EST" &&
    tableName !== "CID" &&
    tableName !== "BAI"
  ) {
    if (!options.userCod && tableName !== "USU") {
      throw Error("É necessário ser um usuário para realizar esta ação");
    }
    instance.createdAtHour = new Date().toLocaleTimeString();
    instance.createdByUserCod = options.userCod;
  }
};
