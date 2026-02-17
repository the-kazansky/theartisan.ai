import { Router } from "express";
import { GraphService } from "../services/graphService";
import { FunctionService } from "../services/functionService";

const router = Router();

const graphService = new GraphService();
const functionService = new FunctionService();

router.get("/:id/neighborhood", (req, res) => {
  const { id } = req.params;
  const graph = graphService.getFunctionNeighborhood(id);
  res.json(graph);
});

router.get("/:id/source", (req, res) => {
  try {
    const data = functionService.getSource(req.params.id);
    res.json(data);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
