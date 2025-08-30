import React, { useState, useEffect } from "react";
import ResetPasswordModal from "./ResetPasswordModal";

const OtpVerificationSuccessModal: React.FC<{ open: boolean; onClose: () => void; email: string }> = ({
  open,
  onClose,
  email,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""]); // Reset OTP when modal opens
      setIsVerified(false); // Reset verification state
      setShowResetPasswordModal(false); // Reset ResetPasswordModal state
      startResendTimer();
      console.log("OtpVerificationSuccessModal opened, email:", email, "otp reset to:", otp);
    }
  }, [open, email, otp]);

  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    console.log("Resending OTP to:", email);
    startResendTimer();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const code = otp.join("");
    console.log("Verifying OTP:", code, "isOtpComplete:", isOtpComplete);
    if (isOtpComplete) {
      setLoading(true);
      setTimeout(() => {
        setIsVerified(true); // Simulate successful verification
        setLoading(false);
      }, 1000); // 1-second delay to simulate API call
    }
  };

  const handleContinue = () => {
    console.log("Continue clicked, initiating transition to ResetPasswordModal");
    setLoading(true);
    setTimeout(() => {
      setShowResetPasswordModal(true);
      setLoading(false);
      onClose();
    }, 1000); // 1-second delay for spinner
  };

  if (!open && !showResetPasswordModal) {
    console.log("OtpVerificationSuccessModal closed, open:", open, "showResetPasswordModal:", showResetPasswordModal);
    return null;
  }

  const maskedEmail = email.length > 8 ? `*****${email.slice(5)}` : email;
  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-${isVerified ? "gray-500" : "black"} bg-opacity-50 backdrop-blur-md animate-fadeIn ${showResetPasswordModal ? "hidden" : ""
          }`}
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg animate-slideInUp"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-white text-lg hover:text-gray-700 bg-event-blue h-8 w-8 rounded-lg flex items-center justify-center"
            onClick={onClose}
          >
            &times;
          </button>

          {!isVerified ? (
            <>
              <h2 className="text-2xl font-bold text-event-blue text-start mb-4">Email Verification</h2>
              <p className="text-[16px] text-gray-600 text-start mb-6">
                Enter the 6-digit code sent to <span className="text-lg text-event-blue font-bold">{maskedEmail}</span>
              </p>
              <div className="space-y-4 p-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="password"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      maxLength={1}
                      className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-event-blue"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <button
                  onClick={handleOtpSubmit}
                  disabled={loading || !isOtpComplete}
                  className="w-full bg-event-blue text-white py-2 rounded-full hover:bg-blue-900 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Verify"
                  )}
                </button>
                <p className="text-center text-sm text-gray-600">
                  Didn&apos;t get code?{" "}
                  {canResend ? (
                    <button onClick={handleResend} className="text-event-blue hover:underline font-bold text-lg">
                      Resend
                    </button>
                  ) : (
                    <span>{resendTimer} seconds</span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl">✓</span>
                </div>
                <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-400 rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-1 h-1 bg-yellow-400 rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-700 text-center mb-2">
                Email Verification Successful
              </h2>
              <p className="text-sm text-gray-500 text-center">
                Continue to Reset your Password
              </p>
              <button
                onClick={handleContinue}
                disabled={loading}
                className="w-full bg-event-blue text-white py-2 rounded-full hover:bg-blue-900 transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <ResetPasswordModal
        open={showResetPasswordModal}
        onClose={() => {
          setShowResetPasswordModal(false);
          onClose(); // Close the entire flow
        }}
        email={email}
      />
    </>
  );
};

export default OtpVerificationSuccessModal;