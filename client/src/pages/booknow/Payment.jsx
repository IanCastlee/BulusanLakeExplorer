import axios from "axios";
import React, { useState } from "react";
import config from "../../BaseURL";

const Payment = () => {
  const [data, setData] = useState({
    amount: 10000,
    description: "Test",
    remarks: "Test remark",
  });
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!data.amount || data.amount <= 0) {
      alert("Invalid amount!");
      return;
    }
    if (!data.description.trim()) {
      alert("Description cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("amount", data.amount);
      formData.append("description", data.description);
      formData.append("remarks", data.remarks);

      const response = await axios.post(
        `${config.apiBaseUrl}/backend/payment.php`,
        formData,
        { withCredentials: true }
      );

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        alert("Failed to fetch the checkout URL.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="button">
        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
