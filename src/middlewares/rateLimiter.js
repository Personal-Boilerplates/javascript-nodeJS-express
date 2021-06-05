import RateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";
import redisConfig from "../../config/redis";

const rateLimiter = new RateLimit({
  store: new RedisStore({
    client: new Redis({
      redisConfig,
    }),
    expiry: 60, // Tempo que o Redis irá armazenar as tentativas
    prefix: "rateLimiter", // Chave armazenada no Redis
  }),
  windowMs: 60 * 1000, // Tempo entre cada rest em milisegundos.
  max: 200, // Limita cada IP em x requisições para cada windowMS.
  message: "Muitas requisições, por favor aguarde um pouco.",
});

export default rateLimiter;
