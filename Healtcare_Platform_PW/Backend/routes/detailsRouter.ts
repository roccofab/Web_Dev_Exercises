import { Router } from "express";
import { addDetail,
    getDetails
 } from "../controllers/detailsController";

const router =  Router();

//CREATE
router.post("/", addDetail);

//READ
router.get("/", getDetails);

export default router;