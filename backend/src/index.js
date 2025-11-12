import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor backend funcionando 🚀" });
});

app.listen(4000, () => {
  console.log("Backend corriendo en http://localhost:4000");
});
