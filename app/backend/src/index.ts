import express from "express";
import cors from "cors";
import searchRoutes from "./routes/search";
import functionRoutes from "./routes/functions";
import packageRoutes from "./routes/packages";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/search", searchRoutes);
app.use("/api/function", functionRoutes);
app.use("/api/packages", packageRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
