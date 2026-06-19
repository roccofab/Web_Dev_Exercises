"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detailsController_1 = require("../controllers/detailsController");
const router = (0, express_1.Router)();
//CREATE
router.post("/", detailsController_1.addDetail);
//READ
router.get("/", detailsController_1.getDetails);
exports.default = router;
//# sourceMappingURL=detailsRouter.js.map