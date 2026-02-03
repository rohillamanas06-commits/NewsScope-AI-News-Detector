import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description: string;
  popular?: boolean;
}

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentCredits?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentCredits = 0
}) => {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchPackages();
      loadRazorpayScript();
    }
  }, [isOpen]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/credits/packages`, {
        credentials: 'include'
      });
      const data = await response.json();
      setPackages(data.packages);
    } catch (err) {
      setError('Failed to load credit packages');
      console.error(err);
    }
  };

  const handlePurchase = async (packageId: string) => {
    setLoading(true);
    setError(null);
    setSelectedPackage(packageId);

    try {
      // Ensure Razorpay script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Payment gateway not loaded. Please refresh and try again.');
      }

      // Step 1: Create order
      const orderResponse = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ package_id: packageId })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to create order. Please try again.');
      }

      const orderData = await orderResponse.json();

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NewsScope',
        description: orderData.package_name,
        order_id: orderData.order_id,
        prefill: {
          email: orderData.customer_email || user?.email || '',
          name: orderData.customer_name || user?.name || '',
          contact: ''
        },
        handler: async function(response: any) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              alert(`Success! ${verifyData.credits_added} credits added to your account.`);
              if (onSuccess) onSuccess();
              onClose();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
            alert('Payment Error: ' + (err.message || 'Payment verification failed'));
          } finally {
            setLoading(false);
            setSelectedPackage(null);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setSelectedPackage(null);
          },
          escape: true,
          animation: true,
          confirm_close: true,
          backdropclose: true
        },
        theme: {
          color: '#d4a574', // NewsScope gold color
          backdrop_color: 'rgba(0, 0, 0, 0.6)'
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using UPI or Cards',
                instruments: [
                  {
                    method: 'upi'
                  },
                  {
                    method: 'card'
                  },
                  {
                    method: 'netbanking'
                  }
                ]
              }
            },
            preferences: {
              show_default_blocks: true
            }
          }
        },
        timeout: 300,
        remember_customer: false
      };

      const razorpay = new window.Razorpay(options);
      
      // Close the dialog before opening Razorpay to prevent conflicts
      onClose();
      
      // Small delay to ensure dialog is closed before opening Razorpay
      setTimeout(() => {
        razorpay.open();
      }, 100);

    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      alert('Error: ' + (err.message || 'Failed to initiate payment'));
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Buy Credits
          </DialogTitle>
          <DialogDescription>
            Current Balance: {currentCredits} Credits
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded text-sm text-destructive">
            {error}
          </div>
        )}
        
        <div className="space-y-3 py-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{pkg.credits} Credits</span>
                    {pkg.popular && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Popular</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ₹{(pkg.price / pkg.credits).toFixed(2)} per credit
                  </div>
                </div>
                <div className="text-2xl font-bold">₹{pkg.price}</div>
              </div>
              
              <Button 
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading && selectedPackage === pkg.id}
                className="w-full"
                variant={pkg.popular ? "default" : "outline"}
              >
                {loading && selectedPackage === pkg.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Buy Now`
                )}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center text-xs text-muted-foreground pt-2 border-t">
          Secure payment via Razorpay
        </div>
      </DialogContent>
    </Dialog>
  );
};
