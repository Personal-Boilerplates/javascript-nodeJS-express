// This will add by default the options {attributes: exclude} on querys
// for querys that do not have this option, it will delete de attributes from the result.

// To add attributes that is excluded by default in some querys, just add the include option.
// If you want to return only specific attributes, you can use the attributes without include and exclude.

// If you dont want to use this, just change it to false.

const useDefaultSettings = true;
const attributesToRemove = [
  "password",
  "token",
  "token_created_at",
  "createdAt",
  "updatedAt"
];

const defaultAttributeExclude = useDefaultSettings ? attributesToRemove : false;

export default defaultAttributeExclude;
