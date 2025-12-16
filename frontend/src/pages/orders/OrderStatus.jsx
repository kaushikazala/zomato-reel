import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../../config/api";

export default function OrderStatus() {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_URL}/api/orders/${orderId}`, {
          withCredentials: true,
        });
        setOrder(res.data?.order ?? res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load order status yet.");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) run();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Order status</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Order status</h2>
      <p style={{ opacity: 0.8 }}>Order ID: {orderId}</p>

      {error ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 6,
            background: "#ffebee",
            color: "#d32f2f",
          }}
        >
          {error}
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>
            This page will work once the backend exposes <code>/api/orders/:orderId</code>.
          </div>
        </div>
      ) : null}

      {order ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700 }}>Status: {order.status || "PLACED"}</div>
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <Link to="/home">Back to Home</Link>
      </div>
    </div>
  );
}
