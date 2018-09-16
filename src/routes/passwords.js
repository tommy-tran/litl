import express from "express";
import requireAuth from "../middlewares/requireAuth";
import User from "../models/User";
import Password from "../models/Password";
import { authenticatePassword } from "../util";

const passwordRouter = express.Router();

// Server side password generation
passwordRouter.post("/create", (req, res) => {
  res.send(Password.generatePassword(req.body));
});

// Get list of passwords
passwordRouter.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("passwords");

  if (user) {
    if (user.password) {
      res.status(401).send("Unauthorized");
    }
    return res.send(user.passwords);
  }
  res.send("This user has no passwords currently");
});

// Save password
/**
 * {
 *    action:
 *    passwordToBeSaved:
 *    authPassword:
 *    passwordToBeDeleted:
 * }
 */
passwordRouter.post("/", requireAuth, async (req, res) => {
  switch (req.body.action) {
    case "fetch": {
      const user = await User.findById(req.user.id);

      const authPassword = req.body.authPassword;
      if (!authPassword)
        res.status(400).send("Missing authentication password");

      const isValid = authenticatePassword(user, authPassword);
      if (isValid) {
        const passwords = user.populate("passwords", "password");
        res.send(passwords);
      }

      res.status(400).send("Invalid authentication password");
    }
    case "save": {
      const user = await User.findById(req.user.id);

      const password = new Password({
        user: req.user.id,
        password: req.body.passwordToBeSaved,
        dateCreated: req.body.dateCreated
      });

      await password.save();

      user.passwords.push({
        _id: password._id
      });

      user.save();

      return res.send(password);
    }
    case "delete": {
      const { passwordToBeDeleted } = req.body;
      const userID = passwordToBeDeleted.user;

      try {
        const user = await User.findById(userID);
        const filteredPasswords = user.passwords.filter(password => {
          return password._id != passwordToBeDeleted._id;
        });
        user.passwords = filteredPasswords;
        await user.save();

        return res.send("Successful deletion request");
      } catch (error) {
        console.error(error);
        res.status(400).send("Invalid request");
      }
    }
    default: {
      res.status(400).send("Invalid request");
    }
  }
});

export default passwordRouter;
