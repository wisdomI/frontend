import React, { useEffect, useState } from "react";
import OtpVerificationModal from "./OtpRecoverPassword";

const ForgetPasswordModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onBackToLogin?: () => void;
}> = ({
  open,
  onClose,
  onBackToLogin,
}) => {
    const [email, setEmail] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);

    useEffect(() => {
      if (open) {
        setEmail("");
        setShowOtpModal(false);
      }
    }, [open]);

    const handleSubmit = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowOtpModal(true);
      onClose(); // Close the current modal
    };

    return (
      <>
        {open ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          >
            <div
              className="relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white text-xl hover:text-gray-100 bg-event-blue h-10 w-10 rounded-lg flex items-center justify-center font-bold"
                onClick={onClose}
              >
                ×
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-event-blue mb-4">
                  Forgot Your Password?
                </h2>
                <h3 className="text-xl font-bold text-event-blue mb-6">
                  Let&apos;s Get You Back In
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  No worries! Enter your registered email, and we&apos;ll send you a secure link to reset your password.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-transparent text-base"
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-event-blue text-white py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  Submit
                </button>

                <p className="text-center text-gray-600">
                  Remembered your Login details?{" "}
                  <button
                    onClick={onBackToLogin || onClose}
                    className="text-event-blue hover:underline font-medium"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <OtpVerificationModal open={showOtpModal} onClose={() => setShowOtpModal(false)} email={email} />
      </>
    );
  };

export default ForgetPasswordModal;