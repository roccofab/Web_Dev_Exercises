"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = require("./config/connection");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
connection_1.prisma
    .$connect()
    .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Error connection:", error);
});
process.on("SIGINT", async () => {
    await connection_1.prisma.$disconnect();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await connection_1.prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=App.js.map