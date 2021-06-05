function customString() {
  String.capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  Object.isString = data => {
    return Object.prototype.toString.call(data) === "[object String]";
  };
}

export default customString();
