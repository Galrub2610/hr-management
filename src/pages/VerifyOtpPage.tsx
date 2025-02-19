// src/pages/VerifyOtpPage.tsx
import { useState } from 'react';
import { auth, initRecaptcha } from '../config/firebase';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtpPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const recaptcha = initRecaptcha("recaptcha-container");
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      setConfirmation(confirmationResult);
      toast.info("📲 OTP sent to your phone.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!confirmation) {
        toast.error("Please send OTP first.");
        return;
      }
      await confirmation.confirm(otp);
      toast.success("✅ 2FA Verification successful!");
      navigate('/companies');
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Invalid OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">2FA Verification</h2>
        <div id="recaptcha-container"></div>
        <input
          type="tel"
          placeholder="📞 Phone Number"
          className="w-full p-2 border rounded mb-4"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
          onClick={handleSendOtp}
        >
          📲 Send OTP
        </button>
        <input
          type="text"
          placeholder="🔐 Enter OTP"
          className="w-full p-2 border rounded mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          onClick={handleVerifyOtp}
        >
          ✅ Verify OTP
        </button>
      </div>
    </div>
  );
}
