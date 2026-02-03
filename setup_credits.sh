#!/bin/bash

# NewsScope Credit System - Quick Setup Script
# This script helps you set up the credit system quickly

echo "=============================================="
echo "NewsScope Credit System - Quick Setup"
echo "=============================================="
echo ""

# Step 1: Install Python dependencies
echo "📦 Step 1: Installing Python dependencies..."
pip install razorpay==1.4.2
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Step 2: Run database migration
echo "🗄️  Step 2: Running database migration..."
python migrate_credits.py
if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi
echo ""

# Step 3: Check environment variables
echo "🔍 Step 3: Checking environment variables..."
if grep -q "RAZORPAY_KEY_ID" .env && grep -q "RAZORPAY_KEY_SECRET" .env; then
    echo "✅ Razorpay credentials found in .env"
else
    echo "⚠️  Razorpay credentials not found in .env"
    echo "Please add the following to your .env file:"
    echo "RAZORPAY_KEY_ID=rzp_live_SBNLSRf2ZEHgMU"
    echo "RAZORPAY_KEY_SECRET=XC2ZXsuZINjpb1lZFLC5NqMP"
fi
echo ""

# Summary
echo "=============================================="
echo "✅ Setup Complete!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Start your Flask server: python NewsScope.py"
echo "2. Start your frontend: npm run dev"
echo "3. Test the credit system"
echo ""
echo "Credit System Features:"
echo "  • New users get 5 free credits"
echo "  • Each analysis costs 1 credit"
echo "  • Buy credits: 20 for ₹50, 100 for ₹100"
echo "  • Payment via Razorpay (UPI/Cards/Net Banking)"
echo ""
echo "To use in your components:"
echo "  import { BuyCreditsModal } from '@/components/BuyCreditsModal';"
echo "  import { useAuth } from '@/contexts/AuthContext';"
echo ""
echo "For more details, see: CREDIT_SYSTEM_IMPLEMENTATION.md"
echo ""
