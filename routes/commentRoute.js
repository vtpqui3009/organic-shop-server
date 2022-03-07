const router = require("express").Router();
const commentController = require("../controller/commentController");

router.get("/comments/:id", commentController.getComments);

module.exports = router;
