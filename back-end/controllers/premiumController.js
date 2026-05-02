const prisma = require("../config/prisma");

const upgradePremium = async (req, res) => {
  try {
    console.log("[PREMIUM] Upgrade request from user:", req.user.id);
    const { plan, validTill } = req.body;
    console.log("[PREMIUM] Body:", { plan, validTill });
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isPremium: true,
        plan: plan || "premium",
        validTill: validTill ? new Date(validTill) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        plan: true,
        validTill: true
      }
    });
    console.log("User after upgrading premium:", updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error("UPGRADE PREMIUM ERROR:", err);
    res.status(500).json({ msg: "Failed to upgrade premium" });
  }
};

const cancelPremium = async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isPremium: false,
        plan: "free",
        validTill: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        plan: true,
        validTill: true
      }
    });
    
    res.json(updatedUser);
  } catch (err) {
    console.error("CANCEL PREMIUM ERROR:", err);
    res.status(500).json({ msg: "Failed to cancel premium" });
  }
};

module.exports = {
  upgradePremium,
  cancelPremium
};
