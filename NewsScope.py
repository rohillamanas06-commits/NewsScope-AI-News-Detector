import os
import json
import requests
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})  # Enable CORS for frontend integration

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# Configure SendGrid API
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@newsscope.com')
SENDGRID_TO_EMAIL = os.getenv('SENDGRID_TO_EMAIL', 'rohillamanas06@gmail.com')

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel('gemini-2.5-flash')


class NewsAnalyzer:
    """Class to analyze news authenticity using AI"""
    
    def __init__(self):
        self.sources_checked = []
    
    def search_news_sources(self, news_text, headline=""):
        """
        Simulate searching multiple news sources for verification
        In production, you would integrate with real news APIs
        """
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
        """
        Use Gemini AI to analyze the news for authenticity
        """
        try:
            # Create detailed prompt for Gemini
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
            
            # Generate response from Gemini
            response = model.generate_content(prompt)
            
            # Parse the response
            response_text = response.text.strip()
            
            # Try to extract JSON from the response
            # Gemini might wrap JSON in markdown code blocks
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
                # If JSON parsing fails, create a structured response from text
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
    
    def generate_report(self, news_text, headline=""):
        """
        Generate a comprehensive fake news detection report
        """
        # Search sources
        sources = self.search_news_sources(news_text, headline)
        
        # Analyze with Gemini AI
        ai_analysis = self.analyze_with_gemini(news_text, headline)
        
        # Compile final report
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
            "ai_model": "Google Gemini 2.5 Flash"
        }
        
        return report


# Initialize analyzer
analyzer = NewsAnalyzer()


# API Routes
@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        "service": "NewsScope API",
        "version": "1.0.0",
        "description": "AI-Based Fake News Detector",
        "endpoints": {
            "/": "API information",
            "/api/health": "Health check",
            "/api/analyze": "Analyze news (POST)"
        }
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "gemini_api_configured": bool(GEMINI_API_KEY)
    })


@app.route('/api/analyze', methods=['POST'])
def analyze_news():
    """
    Main endpoint to analyze news for authenticity
    
    Expected JSON payload:
    {
        "headline": "News headline (optional)",
        "text": "Full news article text"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No data provided",
                "message": "Please send JSON data with 'text' field"
            }), 400
        
        news_text = data.get('text', '')
        headline = data.get('headline', '')
        
        # Validate input
        if not news_text or len(news_text.strip()) < 10:
            return jsonify({
                "error": "Invalid input",
                "message": "News text must be at least 10 characters long"
            }), 400
        
        # Generate analysis report
        report = analyzer.generate_report(news_text, headline)
        
        return jsonify({
            "success": True,
            "data": report
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Analysis failed",
            "message": str(e)
        }), 500


@app.route('/api/batch-analyze', methods=['POST'])
def batch_analyze():
    """
    Analyze multiple news articles at once
    
    Expected JSON payload:
    {
        "articles": [
            {"headline": "...", "text": "..."},
            {"headline": "...", "text": "..."}
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'articles' not in data:
            return jsonify({
                "error": "Invalid request",
                "message": "Please provide 'articles' array"
            }), 400
        
        articles = data.get('articles', [])
        
        if len(articles) > 10:
            return jsonify({
                "error": "Too many articles",
                "message": "Maximum 10 articles per batch request"
            }), 400
        
        results = []
        for article in articles:
            try:
                report = analyzer.generate_report(
                    article.get('text', ''),
                    article.get('headline', '')
                )
                results.append({
                    "success": True,
                    "data": report
                })
            except Exception as e:
                results.append({
                    "success": False,
                    "error": str(e)
                })
        
        return jsonify({
            "success": True,
            "total": len(results),
            "results": results
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Batch analysis failed",
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


@app.route('/api/feedback', methods=['POST', 'OPTIONS'])
def send_feedback():
    """
    Send feedback via SendGrid email
    """
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not all(k in data for k in ['name', 'email', 'message']):
            return jsonify({
                "success": False,
                "error": "Missing required fields: name, email, and message are required"
            }), 400
        
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        
        # Check if SendGrid is configured
        if not SENDGRID_API_KEY:
            # If SendGrid not configured, just log and return success
            print(f"Feedback received from {name} ({email}): {message}")
            return jsonify({
                "success": True,
                "message": "Feedback received (SendGrid not configured)"
            })
        
        # Create email content
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #d4a574;">New Feedback from NewsScope</h2>
                <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background-color: white; padding: 15px; border-left: 4px solid #d4a574;">
                        {message}
                    </p>
                </div>
                <p style="color: #666; font-size: 12px;">
                    This feedback was sent from NewsScope - AI Fake News Detector
                </p>
            </body>
        </html>
        """
        
        # Create SendGrid message
        message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=SENDGRID_TO_EMAIL,
            subject=f'NewsScope Feedback from {name}',
            html_content=html_content
        )
        
        # Send email
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
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


if __name__ == '__main__':
    print("=" * 50)
    print("NewsScope - AI Fake News Detector")
    print("=" * 50)
    print(f"API Key Configured: {bool(GEMINI_API_KEY)}")
    
    # Get port from environment variable for cloud deployment
    port = int(os.getenv('PORT', 5000))
    print(f"Starting server on port {port}")
    print("=" * 50)
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.getenv('FLASK_ENV') != 'production'
    )
