const prisma = require("../config/prisma");

const cancelPremium = async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isPremium: false,
        plan: "free",
        validTill: null,
        razorpayOrderId: null,
        razorpayPaymentId: null
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
  cancelPremium
};
