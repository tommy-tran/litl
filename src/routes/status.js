import express from "express";
import User from "../models/User";
import requireAuth from "../middlewares/requireAuth";

const statusRouter = express.Router();

statusRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    const status = {
      id: user._id,
      status: user.status,
      lastStatusUpdate: user.lastStatusUpdate
    };
    res.send(status);
  } catch (ex) {
    console.log(ex);
  }
});

statusRouter.post("/", requireAuth, async (req, res) => {
  if (typeof req.body.status != "string")
    res.status(400).send("String is required as status");

  try {
    const result = await User.findByIdAndUpdate(
      req.user.id,
      {
        status: req.body.status,
        lastStatusUpdate: Date.now()
      },
      { new: true }
    );

    return res.send({
      id: result._id,
      status: result.status,
      lastStatusUpdate: result.lastStatusUpdate
    });
  } catch (ex) {
    console.log(ex);
  }
});

export default statusRouter;
