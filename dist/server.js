"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const app_1 = __importDefault(require("./app"));
const port = validateEnv_1.default.PORT;
mongoose_1.default.connect(validateEnv_1.default.MONGO_CONNECTION_STRING)
    .then(() => {
    // eslint-disable-next-line no-console
    console.log("Mongoose Connected");
    app_1.default.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log("Server running on port: " + port);
    });
})
    .catch(console.error);
