import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // received from Sign page

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5200/logic/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Email verified! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setErrorMsg(data.msg || "Verification failed");
      }
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <p>Enter the 6-digit code sent to <strong>{email}</strong></p>
      <form>
        <input
          type="text"
          placeholder="Enter OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit" onClick={handleVerify}>Verify</button>
      </form>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
    </div>
  );
};

export default VerifyOTP;