import React, { useState } from "react";

const ResetPasswordModal: React.FC<{ open: boolean; onClose: () => void; email: string }> = ({
  open,
  onClose,
  email,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Submit clicked, newPassword:", newPassword, "confirmPassword:", confirmPassword); // Debug log
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError("");
    console.log("Password reset successful for:", email, "with new password:", newPassword);
    setShowSuccess(true); // Switch to success view
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  if (!open) {
    console.log("ResetPasswordModal closed, open:", open); // Debug log
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white text-lg hover:text-gray-700 bg-event-blue h-8 w-8 rounded-lg flex items-center justify-center"
          onClick={onClose}
        >
          &times;
        </button>

        {showSuccess ? (
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">✓</span>
              </div>
              <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-700 text-center mb-2">
              Password Reset Successful
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              You have successfully reset your password.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-event-blue text-white py-2 rounded-full hover:bg-blue-900 transition-colors"
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-event-blue text-start mb-2">
              Forgot Your Password?
            </h2>
            <h3 className="text-xl font-bold text-event-blue text-start mb-4">
              Let&apos;s Get You Back In
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-event-blue pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-3 top-8 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-event-blue pr-10"
                />
                <button
                  type="button"
                  onClick={handleToggleConfirmPassword}
                  className="absolute right-3 top-8 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                onClick={handleSubmit}
                className="w-full bg-event-blue text-white py-2 rounded-full hover:bg-blue-900 transition-colors"
                disabled={!newPassword || !confirmPassword}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;