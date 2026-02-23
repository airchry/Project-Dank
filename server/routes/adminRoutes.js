export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);

router.post("/", authMiddleware, requireAdmin, gameController.createGame);
router.delete("/:id", authMiddleware, requireAdmin, gameController.deleteGame);
