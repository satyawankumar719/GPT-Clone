import { Router } from "express";
const router = Router();
router.post("/conversations", (req, res) => {
    console.log("Received request body:", req.body);
    res.json({ message: "Test route is working!" });
});
export default router;