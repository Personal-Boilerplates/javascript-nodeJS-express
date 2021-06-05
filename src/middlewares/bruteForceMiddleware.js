import ExpressBrute from "express-brute";
import RedisStore from "express-brute-redis";
import redisConfig from "../../config/redis";

const store = new RedisStore({ redisConfig, prefix: "bruteForce:" });
const bruteforce = new ExpressBrute(store);

export const bruteForcePrevent =
  process.env.NODE_ENV === "production" ? bruteforce.prevent : (req, res, next) => next();

export default bruteforce;
