export const beforeBulkCreate = (instances, options) => {
  const tableName = instances.constructor.tableName;
  if (
    tableName !== "REG" &&
    tableName !== "EST" &&
    tableName !== "CID" &&
    tableName !== "BAI"
  ) {
    if (!options.userCod) {
      throw Error("É necessário ser um usuário para realizar esta ação");
    }
    instances.forEach((instance) => {
      instance.createdAtHour = new Date().toLocaleTimeString();
      instance.createdByUserCod = options.userCod;
    });
  }
};
