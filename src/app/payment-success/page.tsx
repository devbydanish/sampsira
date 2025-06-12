'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: string;
    isSubscription: boolean;
    productName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaymentDetails() {
      if (!sessionId) {
        setError('No session ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payment-details?session_id=${sessionId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }

        const data = await response.json();
        setPaymentDetails(data);
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('Failed to load payment details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPaymentDetails();
  }, [sessionId]);

  // Redirect to home after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container text-center py-5" style={{ marginTop: '100px' }}>
      <div className="card mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body p-5">
          <div className="mb-4">
            <div className="bg-success text-white rounded-circle mx-auto mb-4" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
              </svg>
            </div>
          </div>
          
          <h1 className="card-title mb-4">Payment Successful!</h1>
          
          {isLoading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : paymentDetails ? (
            <div className="mb-4">
              <p className="card-text fs-5">
                {paymentDetails.isSubscription
                  ? `You've successfully subscribed to ${paymentDetails.productName}`
                  : `You've successfully purchased ${paymentDetails.productName}`}
              </p>
              <p className="card-text text-muted">Amount: {paymentDetails.amount}</p>
            </div>
          ) : (
            <p className="card-text">Your payment has been processed successfully.</p>
          )}
          
          <p className="card-text text-muted mb-4">You will be redirected to the homepage in 5 seconds.</p>
          
          <div className="mt-4">
            <Link href="/" className="btn btn-primary">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 