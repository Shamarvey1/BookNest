const prisma = require("../config/prisma");
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ msg: "Failed to load profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        bio,
        avatarUrl
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true
      }
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};
module.exports = {
  getProfile,
  updateProfile
};
