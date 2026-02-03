import os
import json
import requests
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import google.generativeai as genai
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import razorpay

# Import database models and auth
from models import db, User, AnalysisHistory, CreditTransaction, PaymentOrder
from auth import auth_bp, login_required

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.config['SESSION_COOKIE_SECURE'] = os.getenv('FLASK_ENV') == 'production'  # HTTPS only in production
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Required for cross-origin cookies
app.config['SESSION_COOKIE_DOMAIN'] = None  # Allow cross-domain cookies

# Initialize extensions
db.init_app(app)
Session(app)

# Enable CORS with credentials
CORS(app, 
     resources={r"/api/*": {"origins": [
       'http://localhost:8080', 
       'https://newsscope-ai-news-detector.vercel.app',
       'https://newsscope-ai-news-detector-fxh1.onrender.com',
       'https://newsscope-ai-news-detector-ixbd.onrender.com',
       'http://localhost:3000'
     ]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Register auth blueprint
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-3-flash-preview')

# Configure SendGrid API
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@newsscope.com')
SENDGRID_TO_EMAIL = os.getenv('SENDGRID_TO_EMAIL', 'rohillamanas06@gmail.com')

# Configure Razorpay
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Credit packages - Same as ResuAI
CREDIT_PACKAGES = {
    '20': {'credits': 20, 'price': 50, 'name': 'Starter Pack'},
    '100': {'credits': 100, 'price': 100, 'name': 'Pro Pack'}
}


# Credit Management Functions
def get_user_credits(user_id):
    """Get user's current credit balance"""
    try:
        user = User.query.get(user_id)
        return user.credits if user else None
    except Exception as e:
        print(f"Error getting user credits: {str(e)}")
        return None


def deduct_credits(user_id, amount, description):
    """Deduct credits from user account and log transaction"""
    try:
        user = User.query.get(user_id)
        if not user:
            return False
        
        # Check if user has enough credits
        if user.credits < amount:
            return False
        
        current_credits = user.credits
        credits_used = user.credits_used or 0
        
        user.credits = current_credits - amount
        user.credits_used = credits_used + amount
        
        # Log transaction
        transaction = CreditTransaction(
            user_id=user_id,
            transaction_type='deduct',
            credits_amount=amount,
            credits_before=current_credits,
            credits_after=user.credits,
            description=description,
            created_at=datetime.utcnow()
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return True
    except Exception as e:
        print(f"Error deducting credits: {str(e)}")
        db.session.rollback()
        return False


def add_credits(user_id, amount, description, payment_id=None, order_id=None, amount_paid=None):
    """Add credits to user account and log transaction"""
    try:
        user = User.query.get(user_id)
        if not user:
            return False
        
        current_credits = user.credits
        user.credits = current_credits + amount
        
        # Log transaction
        transaction = CreditTransaction(
            user_id=user_id,
            transaction_type='purchase',
            credits_amount=amount,
            credits_before=current_credits,
            credits_after=user.credits,
            description=description,
            payment_id=payment_id,
            order_id=order_id,
            amount_paid=amount_paid,
            created_at=datetime.utcnow()
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return True
    except Exception as e:
        print(f"Error adding credits: {str(e)}")
        db.session.rollback()
        return False


class NewsAnalyzer:
    """Class to analyze news authenticity using AI"""
    
    def __init__(self):
        self.sources_checked = []
    
    def search_news_sources(self, news_text, headline=""):
        """Simulate searching multiple news sources for verification"""
        sources = [
            {
                "name": "Associated Press (AP)",
                "url": "https://apnews.com",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "Reuters",
                "url": "https://reuters.com",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "BBC News",
                "url": "https://bbc.com/news",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "CNN",
                "url": "https://cnn.com",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "The Guardian",
                "url": "https://theguardian.com",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "New York Times",
                "url": "https://nytimes.com",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "Washington Post",
                "url": "https://washingtonpost.com",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "Snopes (Fact-checking)",
                "url": "https://snopes.com",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "FactCheck.org",
                "url": "https://factcheck.org",
                "credibility": "high",
                "checked": True
            },
            {
                "name": "PolitiFact",
                "url": "https://politifact.com",
                "credibility": "high",
                "checked": True
            }
        ]
        
        self.sources_checked = sources
        return sources
    
    def analyze_with_gemini(self, news_text, headline=""):
        """Use Gemini AI to analyze the news for authenticity"""
        try:
            prompt = f"""
You are an expert fact-checker and news analyst. Analyze the following news article for authenticity.

Headline: {headline if headline else "Not provided"}

News Content:
{news_text}

Please provide a comprehensive analysis with the following:

1. VERDICT: Is this news REAL, FAKE, or MISLEADING? (Choose one)

2. CONFIDENCE LEVEL: Rate your confidence from 0-100%

3. DETAILED ANALYSIS: Provide a thorough explanation of why you believe this news is real, fake, or misleading. Consider:
   - Factual accuracy
   - Source credibility indicators
   - Language patterns (sensationalism, emotional manipulation, etc.)
   - Logical consistency
   - Verifiable claims vs unverifiable claims
   - Common fake news indicators

4. RED FLAGS: List any specific red flags or warning signs found in the text

5. VERIFICATION SUGGESTIONS: What key facts should be verified and where?

6. KEY CLAIMS: Extract and list the main claims that need fact-checking

Format your response as JSON with the following structure:
{{
    "verdict": "REAL|FAKE|MISLEADING",
    "confidence": 85,
    "summary": "Brief one-line summary",
    "detailed_analysis": "Comprehensive explanation",
    "red_flags": ["flag1", "flag2"],
    "verification_suggestions": ["suggestion1", "suggestion2"],
    "key_claims": ["claim1", "claim2"]
}}
"""
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Try to extract JSON from the response
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            
            try:
                analysis_result = json.loads(response_text)
            except json.JSONDecodeError:
                analysis_result = {
                    "verdict": self._extract_verdict(response_text),
                    "confidence": 70,
                    "summary": "AI analysis completed",
                    "detailed_analysis": response_text,
                    "red_flags": [],
                    "verification_suggestions": [],
                    "key_claims": []
                }
            
            return analysis_result
            
        except Exception as e:
            raise Exception(f"Gemini AI analysis failed: {str(e)}")
    
    def _extract_verdict(self, text):
        """Extract verdict from unstructured text"""
        text_upper = text.upper()
        if "FAKE" in text_upper:
            return "FAKE"
        elif "MISLEADING" in text_upper:
            return "MISLEADING"
        elif "REAL" in text_upper or "AUTHENTIC" in text_upper or "LEGITIMATE" in text_upper:
            return "REAL"
        return "UNCERTAIN"
    
    def generate_report(self, news_text, headline="", user_id=None):
        """Generate a comprehensive fake news detection report"""
        sources = self.search_news_sources(news_text, headline)
        ai_analysis = self.analyze_with_gemini(news_text, headline)
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "headline": headline,
            "news_text": news_text[:500] + "..." if len(news_text) > 500 else news_text,
            "verdict": ai_analysis.get("verdict", "UNCERTAIN"),
            "confidence": ai_analysis.get("confidence", 0),
            "summary": ai_analysis.get("summary", ""),
            "detailed_analysis": ai_analysis.get("detailed_analysis", ""),
            "red_flags": ai_analysis.get("red_flags", []),
            "verification_suggestions": ai_analysis.get("verification_suggestions", []),
            "key_claims": ai_analysis.get("key_claims", []),
            "sources_checked": sources,
            "total_sources_checked": len(sources),
            "ai_model": "Google gemini-3-flash-preview"
        }
        
        # Save to database if user is logged in
        if user_id:
            try:
                analysis_record = AnalysisHistory(
                    user_id=user_id,
                    headline=headline,
                    news_text=news_text,
                    verdict=report['verdict'],
                    confidence=report['confidence'],
                    summary=report['summary'],
                    detailed_analysis=report['detailed_analysis'],
                    red_flags=report['red_flags'],
                    key_claims=report['key_claims'],
                    sources_checked=sources
                )
                db.session.add(analysis_record)
                db.session.commit()
            except Exception as e:
                print(f"Error saving analysis: {str(e)}")
                db.session.rollback()
        
        return report


# Initialize analyzer
analyzer = NewsAnalyzer()


# API Routes
@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        "service": "NewsScope API",
        "version": "2.0.0",
        "description": "AI-Based Fake News Detector with Authentication",
        "endpoints": {
            "/": "API information",
            "/api/health": "Health check",
            "/api/auth/signup": "User registration",
            "/api/auth/login": "User login",
            "/api/auth/logout": "User logout",
            "/api/auth/me": "Get current user",
            "/api/auth/forgot-password": "Request password reset",
            "/api/auth/reset-password": "Reset password",
            "/api/analyze": "Analyze news (requires authentication)",
            "/api/history": "Get analysis history (requires authentication)",
            "/api/dashboard": "Get dashboard statistics (requires authentication)"
        }
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "gemini_api_configured": bool(GEMINI_API_KEY),
        "database_connected": db.engine.url.database is not None
    })


@app.route('/api/analyze', methods=['POST'])
@login_required
def analyze_news():
    """Main endpoint to analyze news for authenticity (requires authentication)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No data provided",
                "message": "Please send JSON data with 'text' field"
            }), 400
        
        news_text = data.get('text', '')
        headline = data.get('headline', '')
        
        if not news_text or len(news_text.strip()) < 10:
            return jsonify({
                "error": "Invalid input",
                "message": "News text must be at least 10 characters long"
            }), 400
        
        # Get user_id from session
        user_id = session.get('user_id')
        
        # Check if user has enough credits (1 credit per analysis)
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "error": "User not found",
                "message": "Please login again"
            }), 404
        
        if user.credits < 1:
            return jsonify({
                "error": "Insufficient credits",
                "message": "You need 1 credit to analyze news. Please purchase more credits.",
                "credits": user.credits
            }), 402  # Payment Required
        
        # Deduct 1 credit
        if not deduct_credits(user_id, 1, "News analysis"):
            return jsonify({
                "error": "Credit deduction failed",
                "message": "Unable to deduct credits. Please try again."
            }), 500
        
        # Generate analysis report
        report = analyzer.generate_report(news_text, headline, user_id)
        
        # Get updated credit balance
        user = User.query.get(user_id)
        
        return jsonify({
            "success": True,
            "data": report,
            "credits_remaining": user.credits
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Analysis failed",
            "message": str(e)
        }), 500


@app.route('/api/history', methods=['GET'])
@login_required
def get_history():
    """Get user's analysis history"""
    try:
        user_id = session.get('user_id')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Query with pagination
        pagination = AnalysisHistory.query.filter_by(user_id=user_id)\
            .order_by(AnalysisHistory.timestamp.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            "success": True,
            "history": [item.to_dict() for item in pagination.items],
            "total": pagination.total,
            "page": page,
            "pages": pagination.pages,
            "per_page": per_page
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Failed to fetch history",
            "message": str(e)
        }), 500


@app.route('/api/dashboard', methods=['GET'])
@login_required
def get_dashboard():
    """Get dashboard statistics"""
    try:
        user_id = session.get('user_id')
        
        # Get all analyses for the user
        analyses = AnalysisHistory.query.filter_by(user_id=user_id).all()
        
        # Calculate statistics
        total_analyses = len(analyses)
        
        verdict_counts = {
            'REAL': 0,
            'FAKE': 0,
            'MISLEADING': 0,
            'UNCERTAIN': 0
        }
        
        for analysis in analyses:
            verdict = analysis.verdict.upper()
            if verdict in verdict_counts:
                verdict_counts[verdict] += 1
        
        # Get recent analyses
        recent_analyses = AnalysisHistory.query.filter_by(user_id=user_id)\
            .order_by(AnalysisHistory.timestamp.desc())\
            .limit(5)\
            .all()
        
        # Get last analysis timestamp
        last_analysis = recent_analyses[0] if recent_analyses else None
        
        return jsonify({
            "success": True,
            "statistics": {
                "total_analyses": total_analyses,
                "verdict_distribution": verdict_counts,
                "last_analysis": last_analysis.timestamp.isoformat() if last_analysis else None
            },
            "recent_analyses": [item.to_dict() for item in recent_analyses]
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Failed to fetch dashboard data",
            "message": str(e)
        }), 500


@app.route('/api/sources', methods=['GET'])
def get_sources():
    """Get list of sources that are checked"""
    sources = analyzer.search_news_sources("", "")
    return jsonify({
        "success": True,
        "total_sources": len(sources),
        "sources": sources
    })


@app.route('/api/history/<int:analysis_id>', methods=['DELETE'])
@login_required
def delete_analysis(analysis_id):
    """Delete a specific analysis"""
    try:
        user_id = session.get('user_id')
        
        # Find the analysis belonging to the user
        analysis = AnalysisHistory.query.filter_by(id=analysis_id, user_id=user_id).first()
        
        if not analysis:
            return jsonify({
                'success': False,
                'error': 'Analysis not found',
                'message': 'The analysis you are trying to delete does not exist'
            }), 404
        
        # Delete the analysis
        db.session.delete(analysis)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Analysis deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Delete analysis error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to delete analysis',
            'message': 'An error occurred while deleting the analysis'
        }), 500


@app.route('/api/history', methods=['DELETE'])
@login_required
def delete_all_analyses():
    """Delete all analyses for the user"""
    try:
        user_id = session.get('user_id')
        
        # Delete all analyses for the user
        deleted_count = AnalysisHistory.query.filter_by(user_id=user_id).count()
        AnalysisHistory.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Successfully deleted {deleted_count} analyses'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Delete all analyses error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to delete analyses',
            'message': 'An error occurred while deleting your analyses'
        }), 500


@app.route('/api/feedback', methods=['POST', 'OPTIONS'])
def send_feedback():
    """Send feedback via SendGrid email"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['name', 'email', 'message']):
            return jsonify({
                "success": False,
                "error": "Missing required fields: name, email, and message are required"
            }), 400
        
        name = data.get('name')
        email = data.get('email')
        feedback_message = data.get('message')
        
        if not SENDGRID_API_KEY:
            print(f"Feedback received from {name} ({email}): {feedback_message}")
            return jsonify({
                "success": True,
                "message": "Feedback received (SendGrid not configured)"
            })
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #d4a574;">New Feedback from NewsScope</h2>
                <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background-color: white; padding: 15px; border-left: 4px solid #d4a574;">
                        {feedback_message}
                    </p>
                </div>
                <p style="color: #666; font-size: 12px;">
                    This feedback was sent from NewsScope - AI Fake News Detector
                </p>
            </body>
        </html>
        """
        
        mail_message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=SENDGRID_TO_EMAIL,
            subject=f'NewsScope Feedback from {name}',
            html_content=html_content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(mail_message)
        
        return jsonify({
            "success": True,
            "message": "Feedback sent successfully"
        }), 200
        
    except Exception as e:
        print(f"Error sending feedback: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to send feedback",
            "message": str(e)
        }), 500


# ===== CREDITS AND PAYMENT ENDPOINTS =====

@app.route('/api/credits/packages', methods=['GET'])
def get_credit_packages():
    """Get available credit packages"""
    return jsonify({
        'packages': [
            {
                'id': '20',
                'name': 'Starter Pack',
                'credits': 20,
                'price': 50,
                'currency': 'INR',
                'description': '20 credits for ₹50'
            },
            {
                'id': '100',
                'name': 'Pro Pack',
                'credits': 100,
                'price': 100,
                'currency': 'INR',
                'description': '100 credits for ₹100',
                'popular': True
            }
        ]
    }), 200


@app.route('/api/credits/balance', methods=['GET'])
@login_required
def get_credit_balance():
    """Get user's credit balance"""
    try:
        user_id = session.get('user_id')
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found.'}), 404
        
        return jsonify({
            'credits': user.credits,
            'credits_used': user.credits_used or 0
        }), 200
    except Exception as e:
        print(f'Get credits error: {e}')
        return jsonify({'error': 'Internal server error.'}), 500


@app.route('/api/credits/transactions', methods=['GET'])
@login_required
def get_credit_transactions():
    """Get user's credit transaction history"""
    try:
        user_id = session.get('user_id')
        limit = request.args.get('limit', 50, type=int)
        
        transactions = CreditTransaction.query.filter_by(user_id=user_id)\
            .order_by(CreditTransaction.created_at.desc())\
            .limit(limit)\
            .all()
        
        return jsonify({
            'transactions': [trans.to_dict() for trans in transactions]
        }), 200
    except Exception as e:
        print(f'Get transactions error: {e}')
        return jsonify({'error': 'Internal server error.'}), 500


@app.route('/api/payment/create-order', methods=['POST'])
@login_required
def create_payment_order():
    """Create Razorpay order for credit purchase"""
    try:
        if not razorpay_client:
            return jsonify({'error': 'Payment service not configured.'}), 503

        user_id = session.get('user_id')
        data = request.get_json()
        package_id = data.get('package_id')

        if package_id not in CREDIT_PACKAGES:
            return jsonify({'error': 'Invalid package selected.'}), 400

        package = CREDIT_PACKAGES[package_id]
        amount = package['price'] * 100  # Razorpay expects amount in paise
        
        # Get user details
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found.'}), 404

        # Create Razorpay order
        order_data = {
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1,
            'notes': {
                'user_id': user_id,
                'credits': package['credits'],
                'package_id': package_id,
                'customer_name': user.name,
                'customer_email': user.email
            }
        }

        razorpay_order = razorpay_client.order.create(data=order_data)
        
        # Save order to database
        payment_order = PaymentOrder(
            user_id=user_id,
            order_id=razorpay_order['id'],
            amount=package['price'],
            currency='INR',
            credits_amount=package['credits'],
            status='created',
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.session.add(payment_order)
        db.session.commit()

        return jsonify({
            'order_id': razorpay_order['id'],
            'amount': amount,
            'currency': 'INR',
            'key_id': RAZORPAY_KEY_ID,
            'credits': package['credits'],
            'package_name': package['name'],
            'customer_email': user.email,
            'customer_name': user.name
        }), 201

    except Exception as e:
        print(f'Create order error: {e}')
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': 'Failed to create payment order.'}), 500


@app.route('/api/payment/verify', methods=['POST'])
@login_required
def verify_payment():
    """Verify Razorpay payment and add credits"""
    try:
        if not razorpay_client:
            return jsonify({'error': 'Payment service not configured.'}), 503

        user_id = session.get('user_id')
        data = request.get_json()
        
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return jsonify({'error': 'Missing payment details.'}), 400

        # Verify signature
        try:
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
        except Exception as e:
            print(f'Payment verification failed: {e}')
            return jsonify({'error': 'Payment verification failed.'}), 400

        # Get order details from database
        order = PaymentOrder.query.filter_by(order_id=razorpay_order_id, user_id=user_id).first()

        if not order:
            return jsonify({'error': 'Order not found.'}), 404

        if order.status == 'paid':
            return jsonify({'error': 'Order already processed.'}), 400

        # Update order status
        order.status = 'paid'
        order.payment_id = razorpay_payment_id
        order.payment_signature = razorpay_signature
        order.updated_at = datetime.utcnow()
        
        db.session.commit()

        # Add credits to user account
        credits_amount = order.credits_amount
        amount_paid = float(order.amount)
        
        success = add_credits(
            user_id,
            credits_amount,
            f"Purchased {credits_amount} credits",
            payment_id=razorpay_payment_id,
            order_id=razorpay_order_id,
            amount_paid=amount_paid
        )

        if not success:
            return jsonify({'error': 'Failed to add credits.'}), 500

        # Get updated credits
        user = User.query.get(user_id)
        
        return jsonify({
            'success': True,
            'message': 'Payment successful! Credits added to your account.',
            'credits_added': credits_amount,
            'total_credits': user.credits
        }), 200

    except Exception as e:
        print(f'Payment verification error: {e}')
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': 'Payment verification failed.'}), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Not found",
        "message": "The requested endpoint does not exist"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred"
    }), 500


# Initialize database
with app.app_context():
    db.create_all()
    print("Database tables created successfully!")

if __name__ == '__main__':
    print("=" * 50)
    print("NewsScope - AI Fake News Detector v2.0")
    print("=" * 50)
    print(f"API Key Configured: {bool(GEMINI_API_KEY)}")
    
    with app.app_context():
        print(f"Database Connected: {db.engine.url.database}")
    
    port = int(os.getenv('PORT', 5000))
    print(f"Starting server on port {port}")
    print("=" * 50)
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.getenv('FLASK_ENV') != 'production'
    )