const prisma = require("../config/prisma");

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "bookId required" });
    }

    const exists = await prisma.favorite.findFirst({
      where: { userId, bookId }
    });

    if (exists) {
      const existing = await prisma.favorite.findFirst({
        where: { userId, bookId },
        include: { book: true },
      });
      return res.json(existing);
    }
    const fav = await prisma.favorite.create({
      data: { userId, bookId },
      include: { book: true }, 
    });

    res.json(fav);
  } catch (err) {
    console.error("FAVORITE ADD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    await prisma.favorite.deleteMany({
      where: { userId, bookId },
    });

    res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error("FAVORITE REMOVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favs = await prisma.favorite.findMany({
      where: { userId },
      include: { book: true }
    });

    res.json(favs);
  } catch (err) {
    console.error("FAVORITE GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
