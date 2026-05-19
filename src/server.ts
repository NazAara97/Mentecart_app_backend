import app from "./app.js";
import { connectDB } from "./config/db.js";
const PORT = process.env.PORT || 3000;
connectDB();


app.get("/", (_req, res) => {
  res.send(" MenteCart API Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});