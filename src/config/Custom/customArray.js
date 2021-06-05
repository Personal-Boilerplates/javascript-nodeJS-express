function customArray() {
  Array.intersect = ([...arrays], sort) => {
    let array = arrays[0];

    for (let i = 1; i < arrays.length; i++) {
      array = array.filter(value => arrays[i].includes(value));
    }

    return array;
  };

  Array.outterJoin = ([...arrays], sort) => {
    let array = [];
    let lostelements = [];
    arrays.forEach(element => {
      array = [
        ...array.filter(value => !element.includes(value)),
        ...element.filter(value =>
          ![...array, ...lostelements].includes(value)
            ? true
            : lostelements.push(value) && false
        )
      ];
    });
    if (sort) {
      array.sort();
      sort === "desc" && array.reverse();
    }

    return array;
  };

  Array.difference = ([...arrays], sort) => {
    let array = arrays[0];

    for (let i = 1; i < arrays.length; i++) {
      array = array.filter(value => !arrays[i].includes(value));
    }

    return array;
  };

  Array.union = ([...arrays], sort) => {
    let sumArrays = [];
    arrays.forEach(element => {
      sumArrays = [...sumArrays, ...element];
    });

    let array = [...new Set([...sumArrays])];
    if (sort) {
      array.sort();
      sort === "desc" && array.reverse();
    }

    return array;
  };
}

export default customArray();
