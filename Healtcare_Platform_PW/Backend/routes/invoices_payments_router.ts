import {Router} from "express";
import { addInvoice, getInvoices, getInvoicebyId, getInvoiceByAppId, addPayment, getPayments } from "../controllers/invoicesPaymentController";
import { authenticateToken } from "../middleware/auth";
import { authorizeRole } from "../middleware/authorize";

const router = Router();

//CREATE
router.post("/invoices", authenticateToken, authorizeRole(["ADMIN"]), addInvoice);
router.post("/payments", authenticateToken, authorizeRole(["ADMIN"]), addPayment);

//READ
router.get("/invoices", authenticateToken, authorizeRole(["ADMIN"]), getInvoices);
router.get("/invoices/:id", authenticateToken, authorizeRole(["ADMIN"]), getInvoicebyId);
router.get("/invoices/appointment/:appId", authenticateToken, authorizeRole(["ADMIN"]), getInvoiceByAppId);
router.get("/payments", authenticateToken, authorizeRole(["ADMIN"]), getPayments);

export default router;