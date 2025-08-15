import Link from "next/link";
import React, { useEffect, useState } from "react";
import OtpVerificationModal from "./OtpRecoverPassword";

const ForgetPasswordModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
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
            className="relative bg-white rounded-lg pt-20 pb-20 pl-8 pr-8 max-w-md w-full mx-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white text-lg hover:text-gray-100 bg-event-blue h-8 w-8 rounded-lg"
              onClick={onClose}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold text-gray-900 text-start mb-2">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-600 text-start mb-4">
              Enter your email address below, and we’ll send you a link to reset your
              password.
            </p>
            <div className="space-y-6 pt-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-event-blue text-white py-1 rounded-full hover:bg-blue-900 transition-colors"
              >
                Submit
              </button>
              <p>
                Remember your Login details?{" "}
                <Link href="/auth/login">Login</Link>
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