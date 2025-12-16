import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";

import { API_URL } from "../../config/api";

function formatCents(cents) {
  if (typeof cents !== "number") return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function OrderFood() {
  const { id: partnerId } = useParams();
  const navigate = useNavigate();
  const { partnerId: cartPartnerId, items, setQty, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const relevantItems = useMemo(() => {
    // If the cart belongs to a different partner, treat as empty for this page.
    if (cartPartnerId && cartPartnerId !== partnerId) return [];
    return items;
  }, [cartPartnerId, partnerId, items]);

  const totalCents = useMemo(() => {
    return relevantItems.reduce((sum, it) => {
      const price = typeof it.priceCents === "number" ? it.priceCents : 0;
      return sum + price * (it.quantity ?? 0);
    }, 0);
  }, [relevantItems]);

  const hasAnyPrice = useMemo(
    () => relevantItems.some((it) => typeof it.priceCents === "number"),
    [relevantItems]
  );

  const placeOrder = async () => {
    setError("");

    if (!partnerId) {
      setError("Missing food partner.");
      return;
    }

    if (relevantItems.length === 0) {
      setError("Your order is empty.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        foodPartnerId: partnerId,
        items: relevantItems.map((it) => ({
          foodId: it.foodId,
          quantity: it.quantity,
        })),
      };

      const res = await axios.post(`${API_URL}/api/orders`, payload, {
        withCredentials: true,
      });

      const orderId = res.data?.order?._id || res.data?._id;
      clearCart();

      if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  // Partner mismatch UX
  if (cartPartnerId && cartPartnerId !== partnerId) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Order Food</h2>
        <p>
          Your cart is currently for a different food partner. Please clear it or go back to that
          partner.
        </p>
        <button onClick={clearCart} className="submit-btn">
          Clear cart
        </button>
        <div style={{ marginTop: 12 }}>
          <Link to={`/food-partner/${partnerId}`}>Back to partner</Link>
        </div>
      </div>
    );
  }

  if (relevantItems.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Order Food</h2>
        <p>No items selected yet.</p>
        <Link to={`/food-partner/${partnerId}`}>Back to partner</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, paddingBottom: 90 }}>
      <h2>Order Food</h2>

      {error ? (
        <div
          style={{
            color: "#d32f2f",
            marginBottom: "1rem",
            padding: "0.75rem",
            backgroundColor: "#ffebee",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      ) : null}

      {!hasAnyPrice ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 6,
            background: "#fff3cd",
            color: "#664d03",
          }}
        >
          Prices are not set yet for these items, so total will show as $0. Add a price field to food
          items in the backend to enable totals.
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {relevantItems.map((it) => (
          <div
            key={it.foodId}
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 10,
              padding: 12,
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div style={{ width: 96, height: 96, borderRadius: 8, overflow: "hidden" }}>
              <video
                src={it.video}
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{it.name || "Food item"}</div>
              <div style={{ opacity: 0.75, fontSize: 13 }}>{formatCents(it.priceCents)}</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={() => setQty({ foodId: it.foodId, quantity: (it.quantity ?? 1) - 1 })}
              >
                -
              </button>
              <div style={{ minWidth: 24, textAlign: "center" }}>{it.quantity ?? 0}</div>
              <button
                type="button"
                onClick={() => setQty({ foodId: it.foodId, quantity: (it.quantity ?? 0) + 1 })}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 12,
          background: "rgba(255,255,255,0.98)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Total</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCents(totalCents)}</div>
        </div>

        <button
          className="submit-btn"
          onClick={placeOrder}
          disabled={submitting}
          style={{ minWidth: 160 }}
        >
          {submitting ? "Placing..." : "Place order"}
        </button>
      </div>
    </div>
  );
}
