'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface OtpInputProps {
  onVerify: (otp: string) => void;
  resendOtp: () => void;
  error: string | null;
  message: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ onVerify, resendOtp, error, message }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextElementSibling) {
      (element.nextElementSibling as HTMLInputElement).focus();
    }

    if (newOtp.every(val => val !== '')) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleResend = () => {
    if (canResend) {
      resendOtp();
      setTimer(60);
      setCanResend(false);
    }
  };

  return (
    <div className="otp-container">
      <h3 className="white text-center mb-30">Verify your email</h3>
      <p className="text-center mb-30">Please enter the OTP sent to your email</p>
      <div className="d-flex justify-content-center gap-2 mb-4">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="otp-input"
          />
        ))}
      </div>
      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={!canResend}
          className="resend-button"
        >
          {canResend ? 'Resend OTP' : `Resend OTP in ${timer}s`}
        </button>
      </div>
    </div>
  );
};

export default OtpInput;