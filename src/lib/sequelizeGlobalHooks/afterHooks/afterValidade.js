let x = 0;
export const afterValidate = (instance, options) => {
  if (instance.changed("cod")) {
    delete instance.dataValues.cod;
  }
};
