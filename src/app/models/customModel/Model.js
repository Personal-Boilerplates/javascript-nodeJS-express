import sequelize from "sequelize";
const { Model, Association, Transaction } = sequelize;

import defaultAttributeExclude from "../../../config/sequelizeQuery.js";

function addDefaultAttributesExclude(options) {
  if (defaultAttributeExclude) {
    options = {
      ...options,
      attributes: (options && options.attributes) || {
        include: [],
        exclude: []
      }
    };

    const { include, exclude } = options.attributes;

    if (include || exclude) {
      let newExclude = [...(exclude || []), ...defaultAttributeExclude];
      include &&
        (newExclude = newExclude.filter(value => !include.includes(value)));

      options.attributes = {
        exclude: newExclude
      };
    }
  }
  return options;
}

class ModelHandler extends Model {
  returnAttributes(options) {
    if (options && options.exclude) {
      const { exclude } = options;

      if (!Array.isArray(exclude)) {
        return delete this.dataValues[exclude];
      }

      return exclude.forEach(attribute => delete this.dataValues[attribute]);
    } else if (options && options.include) {
      const { include } = options;

      if (!Array.isArray(include)) {
        return (this.dataValues = this.dataValues[include]);
      }

      const checkAttributes = Object.keys(this.dataValues);

      return (this.dataValues = {
        ...checkAttributes.forEach(attribute => this.dataValues[attribute])
      });
    }
  }

  static handleError(err) {
    if (process.env.NODE_ENV === "production") {
      try {
        const errors = err.errors.message;
        console.log(errors);
        return errors;
      } catch {
        console.log("aew");
        return { message: "Ocorreu um erro inesperado." };
      }
    }
    console.log(err);
    throw err;
  }

  /**
   * Builds a new model instance and calls save on it.
   * @param {Object} values It is the body of the requisiton.
   * @param {Object} options Options to custom the requisition.
   *
   * @param {String[]} options.fields If set, only columns matching those in fields will be saved
   *
   * @param {Boolean} options.hooks
   *
   * @param {Boolean} options.logging  function that gets executed while running the query to log the sql.
   *
   * @param {Boolean} options.benchmark Pass query execution time in milliseconds as second argument to logging function (options.logging).
   *
   * @param {Transaction} options.transaction Transaction to run query under
   *
   * @param {String} options.onDuplicate onDuplicate
   *
   * @param {Boolean} options.validate If false, validations won't be run.
   *
   * @param {Object} options.attributes If set, it will include/exclude attributes after return the query.
   * All attributes are included by default, but it if setted, it will spicify the ones that will be returned.
   * @param {String[]} options.attributes.include Set the attributes you want to include
   * @param {String[]} options.attributes.exclude Set the attributes you want to exclude
   *
   * @param {Object} options.include A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   * @param {Model} options.include.model
   * @param {String} options.include.as
   * @param {Association} options.include.association
   * @param {Object} options.include.where
   * @param {Boolean} options.include.or
   * @param {Object} options.include.on
   * @param {Object} options.include.attributes
   * @param {Boolean} options.include.required
   * @param {Boolean} options.include.right
   * @param {Boolean} options.include.separate
   * @param {Number} options.include.limit
   * @param {Object} options.include.through
   * @param {Object} options.include.include
   * @param {Boolean} options.include.duplicating
   *
   * @param {Boolean} options.raw If set to true, values will ignore field and virtual setters.
   *
   * @param {Boolean} options.isNewRecord Is this record new
   *
   * @param {Boolean} options.silent If true, the updatedAt timestamp will not be updated.
   */
  // static async create(values, options) {
  //   try {
  //     const result = await Model.create.apply(this, arguments);

  //     try {
  //       if (defaultAttributeExclude) {
  //         let attributes = [...defaultAttributeExclude];
  //         if (options && options.attributes) {
  //           const { include, exclude } = options.attributes;
  //           exclude && attributes.push(exclude);
  //           include &&
  //             (attributes = attributes.filter(
  //               value => !include.includes(value)
  //             ));
  //         }
  //         delete attributes.forEach(
  //           attribute => delete result.dataValues[attribute]
  //         );
  //       }

  //       return result;
  //     } catch {
  //       return result;
  //     }
  //   } catch (err) {
  //     return this.handleError(err);
  //   }
  // }

  /**
   * Search for multiple instances.
   *
   * __Simple search using AND and =__
   * ```js
   * Model.findAll({
   *   where: {
   *     attr1: 42,
   *     attr2: 'cake'
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 = 42 AND attr2 = 'cake'
   * ```
   *
   * __Using greater than, less than etc.__
   * ```js
   *
   * Model.findAll({
   *   where: {
   *     attr1: {
   *       gt: 50
   *     },
   *     attr2: {
   *       lte: 45
   *     },
   *     attr3: {
   *       in: [1,2,3]
   *     },
   *     attr4: {
   *       ne: 5
   *     }
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 > 50 AND attr2 <= 45 AND attr3 IN (1,2,3) AND attr4 != 5
   * ```
   * Possible options are: `[Op.ne], [Op.in], [Op.not], [Op.notIn], [Op.gte], [Op.gt], [Op.lte], [Op.lt], [Op.like], [Op.ilike]/[Op.iLike], [Op.notLike],
   * [Op.notILike], '..'/[Op.between], '!..'/[Op.notBetween], '&&'/[Op.overlap], '@>'/[Op.contains], '<@'/[Op.contained]`
   *
   * __Queries using OR__
   * ```js
   * Model.findAll({
   *   where: Sequelize.and(
   *     { name: 'a project' },
   *     Sequelize.or(
   *       { id: [1,2,3] },
   *       { id: { gt: 10 } }
   *     )
   *   )
   * })
   * ```
   * ```sql
   * WHERE name = 'a project' AND (id` IN (1,2,3) OR id > 10)
   * ```
   *
   * The success listener is called with an array of instances if the query succeeds.
   *
   * @see {Sequelize#query}
   *
   * @param {Object} options Options to custom find
   *
   * @param {Object} options.attributes If set, it will include/exclude attributes after return the query.
   * All attributes are included by default, but it if setted, it will spicify the ones that will be returned.
   * @param {String[]} options.attributes.include Set the attributes you want to include
   * @param {String[]} options.attributes.exclude Set the attributes you want to exclude
   *
   * @param {Object} options.where Options to describe the scope of the search.
   *
   * @param {String} options.type The type of query you are executing. The query type affects how results are formatted before they are
   * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   *
   * @param {Object} options.include A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   * @param {Model} options.include.model
   * @param {String} options.include.as
   * @param {Association} options.include.association
   * @param {Object} options.include.where
   * @param {Boolean} options.include.or
   * @param {Object} options.include.on
   * @param {Object} options.include.attributes
   * @param {Boolean} options.include.required
   * @param {Boolean} options.include.right
   * @param {Boolean} options.include.separate
   * @param {Number} options.include.limit
   * @param {Object} options.include.through
   * @param {Object} options.include.include
   * @param {Boolean} options.include.duplicating
   *
   * @param {String[]} options.order Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   *
   * @param {Array} options.group GROUP BY in sql
   *
   * @param {Number} options.limit Limit the results
   *
   * @param {Number} options.offset Skip the results;
   *
   * @param {Boolean} options.lock Lock the selected rows. Possible options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE.
   * Postgres also supports transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model
   * locks with joins. See [transaction.LOCK for an example](transaction#lock)
   *
   * @param {Boolean} options.skipLocked Skip locked rows. Only supported in Postgres.
   *
   * @param {Boolean} options.raw Return raw result. See sequelize.query for more information.
   *
   * @param {Object} options.having Select group rows after groups and aggregates are computed.
   *
   * @param {Boolean} options.subQuery Use sub queries (internal)
   */
  static async findAll(options) {
    try {
      options = addDefaultAttributesExclude(options);
      const result = await Model.findAll.apply(this, [options]);

      return result;
    } catch {
      try {
        const result = await Model.findAll.apply(this, [options]);

        return result;
      } catch (err) {
        return this.handleError(err);
      }
    }
  }

  /**
   * Search for a single instance by its primary key. This applies LIMIT 1, so the listener will
   * always be called with a single instance.
   *
   * @param {Object} identifier Set the primary key to be searched.
   * @param {Object} options Options to custom find.
   *
   * @param {Object} options.attributes If set, it will include/exclude attributes after return the query.
   * All attributes are included by default, but it if setted, it will spicify the ones that will be returned.
   * @param {String[]} options.attributes.include Set the attributes you want to include
   * @param {String[]} options.attributes.exclude Set the attributes you want to exclude
   *
   * @param {String} options.type The type of query you are executing. The query type affects how results are formatted before they are
   * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   *
   * @param {Object} options.include A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   * @param {Model} options.include.model
   * @param {String} options.include.as
   * @param {Association} options.include.association
   * @param {Object} options.include.where
   * @param {Boolean} options.include.or
   * @param {Object} options.include.on
   * @param {Object} options.include.attributes
   * @param {Boolean} options.include.required
   * @param {Boolean} options.include.right
   * @param {Boolean} options.include.separate
   * @param {Number} options.include.limit
   * @param {Object} options.include.through
   * @param {Object} options.include.include
   * @param {Boolean} options.include.duplicating
   *
   * @param {String[]} options.order Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   *
   * @param {Array} options.group GROUP BY in sql
   *
   * @param {Number} options.offset Skip the results;
   *
   * @param {Boolean} options.lock Lock the selected rows. Possible options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE.
   * Postgres also supports transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model
   * locks with joins. See [transaction.LOCK for an example](transaction#lock)
   *
   * @param {Boolean} options.skipLocked Skip locked rows. Only supported in Postgres.
   *
   * @param {Boolean} options.raw Return raw result. See sequelize.query for more information.
   *
   * @param {Object} options.having Select group rows after groups and aggregates are computed.
   *
   * @param {Boolean} options.subQuery Use sub queries (internal)
   */
  static async findByPk(identifier, options) {
    try {
      const result = await Model.findByPk.apply(this, [identifier, options]);

      return result;
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * Search for a single instance. This applies LIMIT 1, so the listener will always be called with a single
   * instance.
   *
   * @param {Object} options Options to custom find
   *
   * @param {Object} options.attributes If set, it will include/exclude attributes after return the query.
   * All attributes are included by default, but it if setted, it will spicify the ones that will be returned.
   * @param {String[]} options.attributes.include Set the attributes you want to include
   * @param {String[]} options.attributes.exclude Set the attributes you want to exclude
   *
   * @param {Object} options.where Options to describe the scope of the search.
   *
   * @param {String} options.type The type of query you are executing. The query type affects how results are formatted before they are
   * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   *
   * @param {Object} options.include A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   * @param {Model} options.include.model
   * @param {String} options.include.as
   * @param {Association} options.include.association
   * @param {Object} options.include.where
   * @param {Boolean} options.include.or
   * @param {Object} options.include.on
   * @param {Object} options.include.attributes
   * @param {Boolean} options.include.required
   * @param {Boolean} options.include.right
   * @param {Boolean} options.include.separate
   * @param {Number} options.include.limit
   * @param {Object} options.include.through
   * @param {Object} options.include.include
   * @param {Boolean} options.include.duplicating
   *
   * @param {String[]} options.order Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   *
   * @param {Array} options.group GROUP BY in sql
   *
   * @param {Number} options.offset Skip the results;
   *
   * @param {Boolean} options.lock Lock the selected rows. Possible options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE.
   * Postgres also supports transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model
   * locks with joins. See [transaction.LOCK for an example](transaction#lock)
   *
   * @param {Boolean} options.skipLocked Skip locked rows. Only supported in Postgres.
   *
   * @param {Boolean} options.raw Return raw result. See sequelize.query for more information.
   *
   * @param {Object} options.having Select group rows after groups and aggregates are computed.
   *
   * @param {Boolean} options.subQuery Use sub queries (internal)
   */
  static async findOne(options) {
    try {
      const result = await Model.findOne.apply(this, arguments);

      return result;
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * Update multiple instances that match the where options. The promise returns an array with one or two
   * elements. The first element is always the number of affected rows, while the second element is the actual
   * affected rows (only supported in postgres with `options.returning` true.)
   *
   * @param {Object} values Insert the body of informations to update
   * @param {Object} options Options to custom the requisition.
   *
   * @param {Object} options.where Options to describe the scope of the search.
   *
   * @param {Object} options.returnMessage Custom the return message, if set true it will return a generic
   * message, you can pass a new message if sucess or fail.
   * @param {Object} options.returnMessage.success Message if it sucess
   * @param {Object} options.returnMessage.fail Message if it fail
   *
   * @param {Boolean} options.paranoid
   *
   * @param {String[]} options.fields If set, only columns matching those in fields will be saved
   *
   * @param {Boolean} options.validate If false, validations won't be run.
   *
   * @param {Boolean} options.hooks
   *
   * @param {Boolean} options.sideEffects
   *
   * @param {Boolean} options.individualHooks
   *
   * @param {Boolean} options.returning
   *
   * @param {Number, Array} options.limit Limit the results
   *
   * @param {Boolean} options.logging  function that gets executed while running the query to log the sql.
   *
   * @param {Boolean} options.benchmark Pass query execution time in milliseconds as second argument to logging function (options.logging).
   *
   * @param {Transaction} options.transaction Transaction to run query under
   *
   * @param {Boolean} options.silent If true, the updatedAt timestamp will not be updated.
   */
  static async update(values, options) {
    try {
      const result = await Model.update.apply(this, arguments);

      if (options && options.returnMessage && result.length == 1) {
        const { success, fail } = options.returnMessage;

        if (result[0] == 1) {
          return success || "Record updated";
        } else {
          return fail || "Record could not be found or updated";
        }
      }

      return result;
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * Search for a single instance using options.where, update it and return this instance values.
   *
   * @param id Set de value of the primary key to be searched.
   * @param values Set the values to be updated.
   * @param options Set the options to update the instance.
   *
   * @param {Object} options.where Options to describe the scope of the search.
   *
   * @param {Object} options.attributes If set, it will include/exclude attributes after return the query.
   * All attributes are included by default, but it if setted, it will spicify the ones that will be returned.
   * @param {String[]} options.attributes.include Set the attributes you want to include
   * @param {String[]} options.attributes.exclude Set the attributes you want to exclude
   *
   * @param {Object} options.include A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   * @param {Model} options.include.model
   * @param {String} options.include.as
   * @param {Association} options.include.association
   * @param {Object} options.include.where
   * @param {Boolean} options.include.or
   * @param {Object} options.include.on
   * @param {Object} options.include.attributes
   * @param {Boolean} options.include.required
   * @param {Boolean} options.include.right
   * @param {Boolean} options.include.separate
   * @param {Number} options.include.limit
   * @param {Object} options.include.through
   * @param {Object} options.include.include
   * @param {Boolean} options.include.duplicating
   *
   * @param {Boolean} options.paranoid
   *
   * @param {String[]} options.fields If set, only columns matching those in fields will be saved
   *
   * @param {Boolean} options.validate If false, validations won't be run.
   *
   * @param {Boolean} options.hooks
   *
   * @param {Boolean} options.sideEffects
   *
   * @param {Boolean} options.individualHooks
   *
   * @param {Boolean} options.returning
   *
   * @param {Boolean} options.logging  function that gets executed while running the query to log the sql.
   *
   * @param {Boolean} options.benchmark Pass query execution time in milliseconds as second argument to logging function (options.logging).
   *
   * @param {Transaction} options.transaction Transaction to run query under
   *
   * @param {Boolean} options.silent If true, the updatedAt timestamp will not be updated.
   */
  static async findOneAndUpdate(values, options) {
    try {
      options = { ...options, limit: 1 };

      const updateRecord = await this.update(values, options);

      if (updateRecord == 0 || !updateRecord) {
        return {
          errors: { message: "This data request could not be found" },
          developmentError: new Error()
        };
      }

      const result = await this.findOne(options);

      return result;
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * Search for a single instance by its primary key, update it and return this instance values.
   *
   * @param id Set de value of the primary key to be searched.
   * @param values Set the values to be updated.
   * @param options Set the options to update the instance.
   *
   * @param {Object} options.attributes If set, it will include/exclude attributes after return the query.
   * All attributes are included by default, but it if setted, it will spicify the ones that will be returned.
   * @param {String[]} options.attributes.include Set the attributes you want to include
   * @param {String[]} options.attributes.exclude Set the attributes you want to exclude
   *
   * @param {Object} options.include A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   * @param {Model} options.include.model
   * @param {String} options.include.as
   * @param {Association} options.include.association
   * @param {Object} options.include.where
   * @param {Boolean} options.include.or
   * @param {Object} options.include.on
   * @param {Object} options.include.attributes
   * @param {Boolean} options.include.required
   * @param {Boolean} options.include.right
   * @param {Boolean} options.include.separate
   * @param {Number} options.include.limit
   * @param {Object} options.include.through
   * @param {Object} options.include.include
   * @param {Boolean} options.include.duplicating
   *
   * @param {Boolean} options.paranoid
   *
   * @param {String[]} options.fields If set, only columns matching those in fields will be saved
   *
   * @param {Boolean} options.validate If false, validations won't be run.
   *
   * @param {Boolean} options.hooks
   *
   * @param {Boolean} options.sideEffects
   *
   * @param {Boolean} options.individualHooks
   *
   * @param {Boolean} options.returning
   *
   * @param {Boolean} options.logging  function that gets executed while running the query to log the sql.
   *
   * @param {Boolean} options.benchmark Pass query execution time in milliseconds as second argument to logging function (options.logging).
   *
   * @param {Transaction} options.transaction Transaction to run query under
   *
   * @param {Boolean} options.silent If true, the updatedAt timestamp will not be updated.
   */
  static async findByIdAndUpdate(identifier, values, options) {
    try {
      const primaryKey = this.primaryKeyAttribute;

      options = { ...options, where: { [primaryKey]: identifier }, limit: 1 };

      const updateRecord = await this.update(values, options);

      if (updateRecord == 0 || !updateRecord) {
        return { error: "Primary Key could not be found" };
      }

      const result = await this.findByPk(identifier, options);

      return result;
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * /**
   * Delete multiple instances, or set their deletedAt timestamp to the current time if `paranoid` is enabled.
   *
   * @return Promise<number> The number of destroyed rows
   *
   * @param {Object} options Options to custom the requisition.
   *
   * @param {Object} options.where Options to describe the scope of the search.
   *
   * @param {Object} options.returnMessage Custom the return message, if set true it will return a generic
   * message, you can pass a new message if sucess or fail.
   * @param {Object} options.returnMessage.success Message if it sucess
   * @param {Object} options.returnMessage.fail Message if it fail
   *
   * @param {Boolean} options.hooks
   *
   * @param {Boolean} options.individualHooks
   *
   * @param {Number} options.limit Limit the results
   *
   * @param {Boolean} options.force
   *
   * @param {Boolean} options.truncate
   *
   * @param {Boolean} options.cascade
   *
   * @param {Boolean} options.restartIdentity
   *
   * @param {Transaction} options.transaction Transaction to run query under
   *
   * @param {Boolean} options.logging  function that gets executed while running the query to log the sql.
   *
   * @param {Boolean} options.benchmark Pass query execution time in milliseconds as second argument to logging function (options.logging).
   */
  static async destroy(options) {
    try {
      const user = await Model.destroy.apply(this, arguments);

      if (options && options.errorMessage) {
        const { success, fail } = options.errorMessage;
        const result = {
          success: success || "Record deleted",
          fail: fail || "Record could not be found or deleted"
        };

        return user ? result.success : result.fail;
      }

      return user;
    } catch (err) {
      return this.handleError(err);
    }
  }
}

export default ModelHandler;
