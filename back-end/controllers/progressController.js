const prisma = require("../config/prisma");

exports.upsertProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, percent, position } = req.body;

    if (!bookId) return res.status(400).json({ message: "bookId required" });

    const progress = await prisma.readingProgress.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: { percent, position },
      create: { userId, bookId, percent, position },
      include: { book: true }
    });

    res.json(progress);
  } catch (err) {
    console.error("PROGRESS UPSERT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    if (!bookId) return res.status(400).json({ message: "bookId required" });

    const progress = await prisma.readingProgress.findUnique({
      where: { userId_bookId: { userId, bookId } },
      include: { book: true }
    });

    if (!progress) return res.status(404).json({ message: "No progress found" });

    res.json(progress);
  } catch (err) {
    console.error("PROGRESS GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const progresses = await prisma.readingProgress.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { updatedAt: "desc" }
    });

    res.json(progresses);
  } catch (err) {
    console.error("PROGRESS GET ALL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    if (!bookId) return res.status(400).json({ message: "bookId required" });

    const deleted = await prisma.readingProgress.deleteMany({
      where: { userId, bookId }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json({ message: "Progress removed" });
  } catch (err) {
    console.error("PROGRESS DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
