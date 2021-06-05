import Logger from "../logger";

export const afterSave = (instance, options) => {
  const tableName = instance.constructor.tableName;
  let deleteFields = ["createdAtHour", "createdByUserCod"];

  const changedFields = instance.changed().filter((e) => !deleteFields.includes(e));

  if (Array.isArray(changedFields) && changedFields.length > 0) {
    Logger(tableName, instance.cod, options.userCod, changedFields);
  }
};
