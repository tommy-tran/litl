import express from "express";
import passport from "passport";
import User from "../models/User";
import requireAuth from "../middlewares/requireAuth";
import { hashPassword } from "../util";

const userRouter = express.Router();

userRouter.all("/github", passport.authenticate("github"));
userRouter.all(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/plus.profile.emails.read"
    ]
  })
);

userRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

userRouter.get("/", (req, res) => {
  // req.session.views = req.session.views ? req.session.views + 1 : 1;
  let user = null;

  if (req.session.passport) {
    let user = req.session.passport;
    return res.send(user);
  }

  res.send({ user });
});

userRouter.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send(err);
    res.send("Destroyed :)");
  });
});

/**
 * For user to add a password
 */
userRouter.post("/", requireAuth, async (req, res, next) => {
  if (!req.body.authPassword)
    return res.status(400).send("Improper password adding request");
  const user = await User.findById(payload.user.id);

  if (user.password) return next(new Error("User already has password"));
  user.password = hashPassword(req.body.authPassword);
  user.save();

  // TODO: Remove
  res.send(user);
});

export default userRouter;
