import { Router } from "express";
import { PackageService } from "../services/packageService";

const router = Router();
const service = new PackageService();

router.get("/", (req, res) => {
  res.json(service.getPackageGraph());
});

router.get("/:name/functions", (req, res) => {
  res.json(service.getFunctionsByPackage(req.params.name));
});

export default router;
