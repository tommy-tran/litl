import productionConfig from "./production";
import developmentConfig from "./development";

if (process.env.NODE_ENV === "production") {
  module.exports = productionConfig;
} else {
  module.exports = developmentConfig;
}
