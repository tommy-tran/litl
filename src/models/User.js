import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/config";

const UserSchema = new Schema({
  githubID: String,
  googleID: String,
  username: {
    type: String
  },
  password: {
    type: String,
    minLength: 5
  },
  status: {
    type: String,
    default: "Trying out this litl app!"
  },
  lastStatusUpdate: {
    type: Date
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  passwords: [
    {
      type: Schema.Types.ObjectId,
      ref: "Password"
    }
  ],
  links: [
    {
      type: Schema.Types.ObjectId,
      ref: "Link"
    }
  ]
});

UserSchema.methods = {
  generateToken() {
    const token = jwt.sign(
      {
        user: {
          id: this._id
        }
      },
      config.JWT_PRIVATE_KEY,
      {
        expiresIn: "7d"
      }
    );
    return token;
  }
};

export default mongoose.model("User", UserSchema);
