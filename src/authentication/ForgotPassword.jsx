import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";
import "./ContactSupport.css";
import LoginLeft from "./common/LoginLeft";
import { IoIosArrowBack } from "react-icons/io";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await apiClient.post("/auth/forgotpassword", { email });

      // Show success message from the server or default message
      const successMessage =
        response.data?.message ||
        "If your email is registered, you will receive a password reset link shortly.";

      setMessage(successMessage);
      toast.success("Password reset email sent successfully");

      // Clear the email field
      setEmail("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while processing your request";

      // If it's a 200 response with a message, show it as info
      if (error.response?.status === 200 && error.response.data?.message) {
        setMessage(error.response.data.message);
      } else {
        toast.error(errorMessage);
      }

      console.error("Error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact_support">
      <div className="row" id="row_contact_support">
        <LoginLeft />
        <div className="col-12 col-md-6 col_right_contact_support">
          <div className="contact_support_container">
            <h2 className="contact_support_title">Forgot Password</h2>
            <section>
              <div className="login_contact_support_footer"></div>

              {message && (
                <div
                  className={`message ${
                    message.includes("registered") ? "info" : "success"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="login_inputContainer mt-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="login_contact_support_submit my-4">
                  <button type="submit" className="login-button">
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="back-button"
                    style={{ marginLeft: "10px", letterSpacing: "1px" }}
                  >
                    Back to Login
                  </button>
                </div>
              </form>

              <div className="login-footer" style={{ fontSize: "20px" }}>
                <p>
                  Remember your password?{" "}
                  <span
                    onClick={() => navigate("/")}
                    className="link"
                    style={{ cursor: "pointer", color: "#007bff" }}
                  >
                    Login here
                  </span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
