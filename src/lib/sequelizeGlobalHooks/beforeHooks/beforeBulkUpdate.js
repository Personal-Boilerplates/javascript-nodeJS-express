export const beforeBulkUpdate = (options) => {
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
    if (options.attributes.createdByUserCod);
    {
      delete options.attributes.createdByUserCod;
    }
    if (options.attributes.createdAtHour) {
      delete options.attributes.createdAtHour;
    }
  }
};
