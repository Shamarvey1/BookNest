import React, { useEffect, useState } from "react";
import { ArrowLeft, Crown, ShieldCheck, Wallet } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createRazorpayOrder, loadRazorpayScript, verifyRazorpayPayment } from "../../services/paymentService";
import "./Checkout.css";

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
    <div className="checkout-page">
      <div className="checkout-container">
        <button
          onClick={() => navigate("/main/premium")}
          className="checkout-back"
        >
          <ArrowLeft size={18} />
          Back to Premium
        </button>

        <div className="checkout-grid">
          <div className="checkout-card">
            <div className="checkout-header">
              <Crown size={28} color="#1e56ff" />
              <div className="checkout-header-copy">
                <h1>Premium Checkout</h1>
                <p>Choose a plan and complete payment through Razorpay.</p>
              </div>
            </div>

            <div className="checkout-plan-list">
              {Object.entries(PLANS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`checkout-plan ${selectedPlan === key ? "selected" : ""}`}
                >
                  <div className="checkout-plan-inner">
                    <div>
                      <div className="checkout-plan-label">{value.label}</div>
                      <div className="checkout-plan-desc">{value.description}</div>
                    </div>
                    <div className="checkout-plan-price">
                      <div className="checkout-plan-amount">{value.price}</div>
                      <div className="checkout-plan-duration">{value.duration}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={openCheckout}
              disabled={loading}
              className="checkout-pay-btn"
            >
              <Wallet size={18} />
              {loading ? "Opening Razorpay..." : `Pay ${plan.price}`}
            </button>
          </div>

          <div className="checkout-summary">
            <div className="checkout-summary-header">
              <ShieldCheck size={22} color="#60a5fa" />
              <h2>Your Order</h2>
            </div>
            <div className="checkout-order-rows">
              <div className="checkout-order-row">
                <span>Plan</span>
                <strong>{plan.label}</strong>
              </div>
              <div className="checkout-order-row">
                <span>Duration</span>
                <strong>{plan.duration}</strong>
              </div>
              <div className="checkout-order-row">
                <span>Price</span>
                <strong>{plan.price}</strong>
              </div>
              <div className="checkout-order-row">
                <span>Payment Gateway</span>
                <strong>Razorpay</strong>
              </div>
            </div>
            <p className="checkout-summary-note">
              After payment, your subscription is verified on the backend and premium access is activated immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}