import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
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
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-background to-background/95 border-gold/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-display text-gold">
            <Coins className="h-6 w-6" />
            Buy Credits
          </DialogTitle>
          <DialogDescription className="text-base">
            Current Balance: <span className="font-semibold text-gold">{currentCredits} Credits</span>
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}
        
        <div className="space-y-4 py-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${
                pkg.popular 
                  ? 'border-gold bg-gold/5 hover:border-gold/80' 
                  : 'border-border/50 hover:border-gold/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-gold to-gold-light rounded-full">
                  <span className="text-xs font-semibold text-background flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Coins className="h-4 w-4 text-gold" />
                    {pkg.credits} credits
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gold">₹{pkg.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ₹{(pkg.price / pkg.credits).toFixed(2)}/credit
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading && selectedPackage === pkg.id}
                className={`w-full font-semibold ${
                  pkg.popular 
                    ? 'bg-gradient-to-r from-gold to-gold-light hover:from-gold/90 hover:to-gold-light/90 text-background' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
                size="lg"
              >
                {loading && selectedPackage === pkg.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Buy {pkg.credits} Credits
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Secure payment powered by Razorpay</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
