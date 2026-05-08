const crypto = require("crypto");
const Razorpay = require("razorpay");
const prisma = require("../config/prisma");

const PLAN_CONFIG = {
  monthly: { amount: 9900, periodDays: 30, label: "Monthly" },
  yearly: { amount: 49900, periodDays: 365, label: "Yearly" },
};

function getPlanConfig(plan) {
  return PLAN_CONFIG[plan] || PLAN_CONFIG.monthly;
}

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are missing in environment variables");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

const createOrder = async (req, res) => {
  try {
    const plan = req.body.plan || "monthly";
    const config = getPlanConfig(plan);
    const razorpay = getRazorpayClient();
    const receipt = `BN_${req.user.id.slice(-8)}_${Date.now() % 100000}`;

    const order = await razorpay.orders.create({
      amount: config.amount,
      currency: "INR",
      receipt,
      notes: {
        userId: req.user.id,
        plan,
      },
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        razorpayOrderId: order.id,
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan,
      label: config.label,
    });
  } catch (err) {
    console.error("CREATE RAZORPAY ORDER ERROR:", err);
    res.status(500).json({ msg: "Failed to create payment order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      plan = "monthly",
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ msg: "Missing payment verification data" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ msg: "Razorpay secret is missing" });
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ msg: "Invalid payment signature" });
    }

    const config = getPlanConfig(plan);
    const validTill = new Date(Date.now() + config.periodDays * 24 * 60 * 60 * 1000);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isPremium: true,
        plan,
        validTill,
        razorpayOrderId,
        razorpayPaymentId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        plan: true,
        validTill: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("VERIFY RAZORPAY PAYMENT ERROR:", err);
    res.status(500).json({ msg: "Failed to verify payment" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};