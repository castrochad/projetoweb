const express = require("express");
const router = express.Router();

const ComentariosController = require("../app/controllers/ComentariosController");

// Rotas das Tarefas
// router.get("/tasks", TasksController.list);
// router.get("/tasks/:id", TasksController.show);
// router.post("/tasks", TasksController.save);
// router.delete("/tasks/:id", TasksController.remove);
// router.put("/tasks/:id", TasksController.update);
// router.put("/tasks/:id/update-status", TasksController.updateStatus);

// Comentarios
router.get("/comentarios/:id_denuncia", ComentariosController.getComentarios);
router.post("/comentarios/:id_denuncia", ComentariosController.inserirComentario);
router.get("/comentarios/:id_denuncia/count", ComentariosController.countComentarios);

// Arquivo Denuncia


router.get("*", function notFound(request, response) {
  return response.status(404).json({ message: "Página não encontrada" });
});

module.exports = router;
