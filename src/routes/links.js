import express from "express";
import Link from "../models/Link";
import User from "../models/User";
import _ from "lodash";
import { hashPassword, authenticatePassword } from "../util";
import requireAuth from "../middlewares/requireAuth";

const linkRouter = express.Router();
const publicProperties = ["_id", "private", "url", "code", "owner"];

async function fetchLink(req, res) {
  if (typeof req.params.code != "string")
    return res.status(404).send("You are lost.. :)");

  const link = await Link.findOne({
    code: req.params.code
  });

  if (!link) return res.status(404).send("You are lost.. :)");

  return link;
}

/**
 * ENDPOINTS
 */

// FETCH LINKS
linkRouter.get("/links", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "links",
    select: publicProperties.join(" ")
  });
  if (user) {
    return res.send(user.links);
  }
  res.send("This user has no links currently");
});

linkRouter.post("/links", async (req, res) => {
  const { action } = req.body;

  // SAVE LINK
  if (action === "SAVE") {
    const { errors } = Link.validateLink(req.body);

    if (errors) return res.status(400).send("Invalid link parameters");

    try {
      const code = await Link.generateCode();

      const password = req.body.password
        ? hashPassword(req.body.password)
        : undefined;

      if (req.user) {
        const user = await User.findById(req.user.id);
        const linkInfo = _.merge(
          req.body,
          { code },
          { owner: user.id },
          { password }
        );
        const link = await new Link(linkInfo).save();
        user.links.push({
          _id: link._id
        });

        await user.save();

        return res.send(_.pick(link, publicProperties));
      }

      // Not logged in
      const linkInfo = _.merge(req.body, { code }, { password });
      const link = await new Link(linkInfo).save();

      return res.send(_.pick(link, publicProperties));
    } catch (ex) {
      console.log(ex.name);
      console.log(ex.message);
      return res.status(400).send({ name: ex.name, message: ex.message });
    }
  }

  // DELETE LINK
  if (action === "DELETE") {
    const { owner, _id } = req.body;

    if (req.user && req.user.id != owner) {
      return res
        .status(401)
        .send(
          "You are not an owner of the link that you are trying to delete."
        );
    }

    const user = await User.findById(owner);

    if (user && user.links) {
      const { links } = user;

      const filteredLinks = links.filter(linkID => {
        return linkID != _id;
      });

      try {
        user.links = filteredLinks;
        await user.save();
        const deletedLink = await Link.findByIdAndRemove(_id);

        res.send(deletedLink);
      } catch (ex) {
        return res.status(400).send({ name: ex.name, message: ex.message });
      }
    }
  }
});

// USAGE ENDPOINT: GO TO LINK
linkRouter.get("/:code", async (req, res) => {
  const link = await fetchLink(req, res);
  if (link.private) {
    return res.status(401).send({
      name: "Authorization Error",
      message: "This link requires a password to continue."
    });
  }
  return res.send(link.url);
});

// USAGE ENDPOINT: GO TO LINK (WITH PASSWORD FOR VERIFICATION)
linkRouter.post("/:code", async (req, res) => {
  // For private links
  const link = await fetchLink(req, res);

  if (link.private) {
    const result = authenticatePassword(link, req.body.password);

    if (result) {
      return res.send(link.url);
    }

    return res.status(400).send({
      name: "Authorization Error",
      message: "An incorrect password was entered."
    });
  }

  // Link is not private
  return res.send(link.url);
});

export default linkRouter;
