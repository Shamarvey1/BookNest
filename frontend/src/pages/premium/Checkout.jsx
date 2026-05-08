import React, { useEffect, useState } from "react";
import { ArrowLeft, Crown, ShieldCheck, Wallet } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createRazorpayOrder, loadRazorpayScript, verifyRazorpayPayment } from "../../services/paymentService";

const PLANS = {
  monthly: {
    label: "Monthly",
    price: "₹99",
    amount: 9900,
    duration: "30 days",
    description: "Best for trying Premium",
  },
  yearly: {
    label: "Yearly",
    price: "₹499",
    amount: 49900,
    duration: "365 days",
    description: "Best value for regular readers",
  },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get("plan") || "monthly");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const openCheckout = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Razorpay checkout could not be loaded.");
      setLoading(false);
      return;
    }

    const order = await createRazorpayOrder(selectedPlan);
    if (!order) {
      alert("Could not create payment order.");
      setLoading(false);
      return;
    }

    const plan = PLANS[selectedPlan] || PLANS.monthly;

    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "BookNest",
      description: `${plan.label} Premium Plan`,
      order_id: order.orderId,
      handler: async (response) => {
        const result = await verifyRazorpayPayment({
          ...response,
          plan: selectedPlan,
        });

        setLoading(false);

        if (result) {
          alert("Payment successful. Premium activated.");
          navigate("/main/premium", { replace: true });
          return;
        }

        alert("Payment verification failed.");
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
      prefill: {
        name: "",
        email: "",
      },
      theme: {
        color: "#1e56ff",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", () => {
      setLoading(false);
      alert("Payment failed. Please try again.");
    });
    razorpay.open();
  };

  const plan = PLANS[selectedPlan] || PLANS.monthly;

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7", padding: "24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/main/premium")}
          style={{
            border: "none",
            background: "transparent",
            color: "#1e56ff",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <ArrowLeft size={18} />
          Back to Premium
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "28px", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <Crown size={28} color="#1e56ff" />
              <div>
                <h1 style={{ margin: 0, fontSize: "28px" }}>Premium Checkout</h1>
                <p style={{ margin: "4px 0 0", color: "#6b7280" }}>Choose a plan and complete payment through Razorpay.</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {Object.entries(PLANS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  style={{
                    textAlign: "left",
                    border: selectedPlan === key ? "2px solid #1e56ff" : "1px solid #dbe3f0",
                    background: selectedPlan === key ? "#f5f8ff" : "#fff",
                    borderRadius: "18px",
                    padding: "18px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: 700 }}>{value.label}</div>
                      <div style={{ color: "#6b7280", marginTop: "4px" }}>{value.description}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#111827" }}>{value.price}</div>
                      <div style={{ color: "#6b7280" }}>{value.duration}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={openCheckout}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "24px",
                border: "none",
                borderRadius: "16px",
                padding: "16px 20px",
                background: loading ? "#8fb0ff" : "#1e56ff",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Wallet size={18} />
              {loading ? "Opening Razorpay..." : `Pay ${plan.price}`}
            </button>
          </div>

          <div style={{ background: "#0f172a", color: "#fff", borderRadius: "24px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <ShieldCheck size={22} color="#60a5fa" />
              <h2 style={{ margin: 0 }}>Your Order</h2>
            </div>
            <div style={{ display: "grid", gap: "14px", fontSize: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Plan</span>
                <strong>{plan.label}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Duration</span>
                <strong>{plan.duration}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Price</span>
                <strong>{plan.price}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Payment Gateway</span>
                <strong>Razorpay</strong>
              </div>
            </div>
            <p style={{ color: "#cbd5e1", marginTop: "20px", lineHeight: 1.6 }}>
              After payment, your subscription is verified on the backend and premium access is activated immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}