export const beforeRestore = (instance, options) => {
  const tableName = instance.constructor.tableName;
  if (
    tableName !== "REG" &&
    tableName !== "EST" &&
    tableName !== "CID" &&
    tableName !== "BAI"
  ) {
    if (!options.userCod) {
      throw Error("É necessário ser um usuário para realizar esta ação");
    }
    instance.createdAtHour = instance.previous("createdAtHour");
    instance.createdByUserCod = instance.previous("createdByUserCod");
    instance.status = 1;
  }
};
