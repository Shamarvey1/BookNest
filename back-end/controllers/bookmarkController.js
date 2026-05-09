const prisma = require("../config/prisma");

const FREE_BOOKMARK_LIMIT = 5;


exports.addBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    if (!bookId) return res.status(400).json({ message: "bookId required" });

    const exists = await prisma.bookmark.findFirst({
      where: { userId, bookId }
    });

    if (exists) return res.json({ message: "Already bookmarked" });

    if (!req.user.isPremium) {
      const bookmarkCount = await prisma.bookmark.count({
        where: { userId },
      });

      if (bookmarkCount >= FREE_BOOKMARK_LIMIT) {
        return res.status(403).json({
          message: `Free users can save up to ${FREE_BOOKMARK_LIMIT} bookmarks. Upgrade to Premium for unlimited bookmarks.`,
        });
      }
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId, bookId },
      include: { book: true },
    });

    res.json(bookmark);

  } catch (err) {
    console.error("BOOKMARK ADD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.bookId;

    await prisma.bookmark.deleteMany({
      where: { userId, bookId }
    });

    res.json({ message: "Bookmark removed" });
  } catch (err) {
    console.error("BOOKMARK REMOVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: { book: true }
    });

    res.json(bookmarks);
  } catch (err) {
    console.error("BOOKMARK GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
