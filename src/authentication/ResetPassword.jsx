import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";
import "./Login.css";
import LoginLeft from "./common/LoginLeft";
import { IoIosArrowBack } from "react-icons/io";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const { userType, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !userType) {
        setIsValidToken(false);
        toast.error("Invalid or missing reset token");
        return;
      }

      try {
        setIsLoading(true);
        // The token is validated when the page loads by checking if we can access it
        // The actual validation happens when the form is submitted with the new password
        setIsValidToken(true);
      } catch (error) {
        console.error("Token validation error:", error);
        setIsValidToken(false);
        toast.error("Invalid or expired reset link");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token, userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsResetting(true);

      // Decode the token in case it was encoded in the URL
      const decodedToken = decodeURIComponent(token);

      console.log("Sending password reset request:", {
        userType,
        tokenLength: token?.length,
        decodedTokenLength: decodedToken?.length,
        passwordLength: password?.length,
      });

      const response = await apiClient.put(
        `/auth/resetpassword/${userType}/${decodedToken}`,
        {
          password,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Password reset successful:", response.data);

      toast.success("Password reset successfully! Redirecting to login...");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Password reset error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data ? "***" : undefined,
        },
      });

      let errorMessage = "Failed to reset password. Please try again.";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage =
            error.response.data?.message || "Invalid or expired reset token";
          setIsValidToken(false);
        } else if (error.response.status === 401) {
          errorMessage =
            "Session expired. Please request a new password reset link.";
          setIsValidToken(false);
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      toast.error(errorMessage);
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-left">
          <LoginLeft />
        </div>
        <div className="login-right">
          <div className="login-form-container">
            <h2>Verifying Reset Link...</h2>
            <p>Please wait while we verify your reset link.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="contact_support">
        <div className="row" id="row_contact_support">
          <LoginLeft />
          <div className="col-12 col-md-6 col_right_contact_support">
            <div className="contact_support_container">
              <h2 className="contact_support_title">Invalid or Expired Link</h2>
              <section>
                <p className="reset-password-text">
                  The password reset link is invalid or has expired. Please
                  request a new password reset link.
                </p>
                <div className="login_contact_support_submit my-4">
                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="login-button"
                    style={{ width: "100%" }}
                  >
                    Request New Reset Link
                  </button>
                </div>
                <div className="login-footer">
                  <p>
                    Remember your password?{" "}
                    <span
                      onClick={() => navigate("/")}
                      className="link"
                      style={{ color: "blue", cursor: "pointer" }}
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
  }

  return (
    <div className="contact_support">
      <div className="row" id="row_contact_support">
        <LoginLeft />
        <div className="col-12 col-md-6 col_right_contact_support">
          <div className="contact_support_container">
            <h2 className="contact_support_title">Reset Your Password</h2>
            <section>
              <div className="login_inputContainer mt-3">
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="login_inputContainer mt-3">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="login_inputContainer mt-3">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="login_contact_support_submit my-4">
                    <button
                      type="submit"
                      className="login-button"
                      disabled={isResetting}
                      style={{ width: "100%" }}
                    >
                      {isResetting ? "Resetting Password..." : "Reset Password"}
                    </button>
                  </div>
                </form>

                <div className="login-footer">
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
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
