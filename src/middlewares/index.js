import express from "express";
import setAuth from "./setAuth";
import passportSetup from "./passportSetup";
import cors from "cors";
import setHeaders from "./setHeaders";
import session from "express-session";
import connectRedis from "connect-redis";
import redis from "redis";
import config from "../config/config";

export default app => {
  app.use(cors());
  app.use(setHeaders);
  app.use(
    express.urlencoded({
      extended: true
    })
  );
  app.use(express.json());

  // Redis setup
  const client = redis.createClient(config.REDIS_PORT, config.REDIS_URI, {
    password: config.REDIS_LABS_PASSWORD
  });
  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: client
      }),
      secret: config.REDIS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false
      // cookie: {secure: true} ONLY IN PRODUCTION
    })
  );
  passportSetup(app);

  client.on("error", function(err) {
    console.log("Error " + err);
  });

  app.use((req, res, next) => {
    if (!req.session) {
      next(new Error("Sessions not working.."));
    }

    next();
  });

  app.use(setAuth);
};
