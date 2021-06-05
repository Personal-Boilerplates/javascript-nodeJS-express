function customJSON() {
  JSON.createPathMerginArray = (mainObject, modelObject, options) => {
    if (
      !mainObject ||
      !Object.values(mainObject)[0] ||
      !Object.isType([{ values: mainObject, type: "Object" }])
    ) {
      mainObject = modelObject;
      return mainObject;
    }

    function mergeJson(main, model) {
      for (var key in model) {
        const checkType = type =>
          Object.prototype.toString.call(main[key]) === `[object ${type}]` &&
          Object.prototype.toString.call(model[key]) === `[object ${type}]`;

        if (checkType("Object")) {
          mergeJson(main[key], model[key]);
        } else if (options) {
          const { array, string, number } = options;
          if (array && checkType("Array")) {
            const {
              union,
              intersect,
              outterJoin,
              difference,
              sort,
              reverseTarget
            } = array;

            let target = reverseTarget ? model[key] : main[key];
            let refference = reverseTarget ? main[key] : model[key];

            if (union) {
              main[key] = [...new Set([...target, ...refference])];
            } else if (intersect) {
              main[key] = target.filter(value => refference.includes(value));
            } else if (outterJoin) {
              main[key] = [
                ...target.filter(value => !refference.includes(value)),
                ...refference.filter(value => !target.includes(value))
              ];
            } else if (difference) {
              main[key] = target.filter(value => !refference.includes(value));
            } else {
              main[key] = [...target, ...refference];
            }

            if (sort) {
              main[key].sort();
              sort === "desc" && main[key].reverse();
            }
          } else if (string && checkType("String")) {
            const {
              reverseTarget,
              before,
              between,
              after,
              arrayTransform
            } = string;

            let target = reverseTarget ? model[key] : main[key];
            let refference = reverseTarget ? main[key] : model[key];

            if (arrayTransform) {
              main[key] = [target, refference];
            } else {
              main[key] =
                (before || "") +
                target +
                (between || "") +
                refference +
                (after || "");
            }
          } else if (number && checkType("Number")) {
            const { reverseTarget, operator } = number;

            if (reverseTarget) {
              main[key] = main[key];
            } else {
              main[key] = eval(`${main[key]} ${operator || "+"} ${model[key]}`);
            }
          } else {
            main[key] = model[key];
          }
        } else {
          main[key] = model[key];
        }
      }

      return main;
    }

    return mergeJson(mainObject, modelObject);
  };
}

export default customJSON();
