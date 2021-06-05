export const afterBulkRestore = (options) => {
  const tableName = options.tableName;
  if (
    tableName !== "REG" &&
    tableName !== "EST" &&
    tableName !== "CID" &&
    tableName !== "BAI"
  ) {
    if (!options.userCod) {
      throw Error("É necessário ser um usuário para realizar esta ação");
    }
    return options.model.update({ status: 1 }, { where: options.where, hooks: false });
  }
};
