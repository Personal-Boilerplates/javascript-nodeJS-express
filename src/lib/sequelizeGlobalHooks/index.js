import { beforeDefine } from "./beforeHooks/beforeDefine";
import { beforeCreate } from "./beforeHooks/beforeCreate";
import { beforeBulkCreate } from "./beforeHooks/beforeBulkCreate";
import { beforeUpdate } from "./beforeHooks/beforeUpdate";
import { beforeBulkUpdate } from "./beforeHooks/beforeBulkUpdate";
import { beforeDestroy } from "./beforeHooks/beforeDestroy";
import { beforeBulkDestroy } from "./beforeHooks/beforeBulkDestroy";
import { beforeRestore } from "./beforeHooks/beforeRestore";
import { afterValidate } from "./afterHooks/afterValidade";
import { afterBulkRestore } from "./afterHooks/afterBulkRestore";
import { afterSave } from "./afterHooks/afterSave";

export default function sequelizeGlobalHooks(sequelize) {
  const hooks = {
    beforeDefine,
    beforeCreate,
    beforeBulkCreate,
    beforeUpdate,
    beforeBulkUpdate,
    beforeDestroy,
    beforeBulkDestroy,
    beforeRestore,
    afterValidate,
    afterBulkRestore,
    afterSave,
  };
  try {
    return Object.values(hooks).forEach((hook) => sequelize.addHook(hook.name, hook));
  } catch (err) {
    throw Error(err);
  }
}
