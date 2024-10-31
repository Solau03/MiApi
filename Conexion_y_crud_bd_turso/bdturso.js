import express from "express"
import { createClient } from "@libsql/client"
import cors from "cors"

const app = express();
const port = parseInt(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }))
const TURSO_DATABASE_URL = "libsql://try-solau-03.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzAxODgwNzcsImlkIjoiN2M5N2Y2ZGYtNGQ4My00YzM2LTg4ZWYtZjExZmI4OTBhNThlIn0.vvJksLhod3DLTFfhCsRpGwjCm6q4sPLdMypDIgnL49t7gyJqt_adSiI_5lPhApndJAdjnKEj3sqDpM_BmVc2CQ";

export const turso = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN
});

//listar
app.get("/productos", async(req, res) =>{
    const ans = await turso.execute(`SELECT * FROM productos`);
    console.log(ans);
    res.json( ans.rows )
});
//crear
app.post("/productos", async (req, res) => {
    const { title, description, value, image } = req.body;
    
    
    try {
      const ans = await turso.execute({
        sql: `INSERT INTO productos (title, description, value, image) VALUES (?, ?, ?, ?)`,
        args: [title, description, value, image]
      });
      res.json({
        mensaje: "Producto creado",
        producto: ans
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        mensaje: "Error al crear el producto"
      });
    }
  });
  //Eliminar
  app.delete("/productos/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await turso.execute({
        sql: `DELETE FROM productos WHERE id= ?`,
        args: [id]
      });
      console.log("Resultado de la eliminación:", result);
      res.json({
        mensaje: "Producto eliminado"
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        mensaje: "Error al eliminar el producto"
      });
    }
  });

//Paraeditar
app.get("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const ans = await turso.execute({
          sql: "SELECT * FROM productos WHERE id = ?",
          args: [id]
      });
      res.json(ans.rows[0]);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(404).json({ mensaje: "Error del servidor" });
  }
});
app.patch("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, value, image } = req.body;

  try {
      const result = await turso.execute({
          sql: `UPDATE productos SET title = ?, description = ?, value = ?, image = ? WHERE id = ?`,
          args: [title, description, value, image, id]
      });

      console.log("Resultado de la actualización: ", { id, title, description, value, image });

      res.json({
          mensaje: "Los cambios se hicieron de la forma esperada",
          result: result.rows
      });
  } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(404).json({
          mensaje: "Error al actualizar el producto"
      });
  }
});

  
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  })