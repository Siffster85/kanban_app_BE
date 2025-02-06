import "dotenv/config";
import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";

const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
      // eslint-disable-next-line no-console
        console.log("Mongoose Connected");
        app.listen(port, () => {
          // eslint-disable-next-line no-console
            console.log("Server running on port: " + port);
        });
    })
    .catch(console.error);
