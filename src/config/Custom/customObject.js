String.capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function customObject() {
  Object.isObject = data => {
    return Object.prototype.toString.call(data) === "[object Object]";
  };

  Object.isType = (data, returnBooleans = false) => {
    const types = [];
    const check = (checkValue, type) => {
      type = type ? type : String.capitalizeFirstLetter(typeof checkValue);
      const boolean =
        Object.prototype.toString.call(checkValue) === `[object ${type}]`;
      types.push(boolean);
    };
    if (Array.isArray(data) && data.length > 0) {
      data.forEach(element => {
        if (element.values) {
          if (Array.isArray(element.values) && data.length > 0) {
            element.values.forEach(value => {
              check(value, element.type);
            });
          } else {
            check(element.values, element.type);
          }
        } else {
          check(element);
        }
      });
    } else {
      check(data);
    }
    const checkReturn = returnBooleans => {
      let checkFalse = true;
      types.find(boolean => {
        if (boolean == false) checkFalse = false;
      });
      return returnBooleans ? types : checkFalse;
    };
    const result = types.length > 1 ? checkReturn(returnBooleans) : types[0];
    return result;
  };
}

export default customObject();
