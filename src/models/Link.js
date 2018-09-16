import mongoose, { Schema } from "mongoose";
import config from "../config/config";
import Joi from "joi";
import generator from "generate-password";
import { getRandomInt } from "../util";

/**
 * Private and user fields are specifically for authentication required links
 */
const linkSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  code: {
    required: true,
    type: String
  },
  url: {
    required: true,
    type: String
  },
  private: {
    type: Boolean,
    required: true,
    default: false,
    validate: {
      validator: function(value) {
        if (value) {
          return this.password ? true : false;
        }

        return true;
      },
      message: "Password must be set if link is private."
    }
  },
  password: {
    type: String,
    min: 5,
    validate: {
      validator: function(value) {
        return this.private;
      },
      message: "Password can only be set if link is private."
    }
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

linkSchema.statics = {
  async generateCode() {
    const length = config.CODE_LENGTH[getRandomInt(config.CODE_LENGTH.length)];

    const code = generator.generate({
      length,
      numbers: true,
      uppercase: true
      // excludeSimilarCharacters: true
    });

    const existingLink = await this.findOne({
      code
    });

    if (existingLink) {
      const result = await this.generateCode();
      return result;
    }

    return code;
  },
  validateLink(link) {
    const re = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

    const schema = {
      url: Joi.string()
        .regex(re)
        .required(),
      private: Joi.boolean().required(),
      password: Joi.string().optional()
    };

    return Joi.validate(link, schema);
  }
};

export default mongoose.model("Link", linkSchema);
