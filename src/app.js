import express from "express";
import applyMiddleware from "./middlewares/";
import mongoose from "mongoose";
import apiRouter from "./routes";
import config from "./config/config";
import path from "path";

const app = express();
applyMiddleware(app);
mongoose.connect(config.MONGO_URI);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../client/build")));
}

app.use("/api", apiRouter);

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, err => {
  console.log(`Server started on port ${PORT}`);
});
