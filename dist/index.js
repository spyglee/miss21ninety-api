"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const databaase_1 = require("./config/databaase");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = 3006;
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: { title: "API Docs", version: "1.0.0" },
    },
    apis: ["./routes/*.ts"],
};
(0, databaase_1.connectDB)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/user', user_1.default);
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// @ts-ignore
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
