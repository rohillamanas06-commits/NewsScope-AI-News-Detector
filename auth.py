from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, session
from functools import wraps
from models import db, User, AnalysisHistory
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

auth_bp = Blueprint('auth', __name__)

# Get SendGrid configuration
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

def login_required(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({
                'success': False,
                'error': 'Authentication required',
                'message': 'Please log in to access this resource'
            }), 401
        return f(*args, **kwargs)
    return decorated_function

def send_reset_email(email, reset_token):
    """Send password reset email using SendGrid"""
    if not SENDGRID_API_KEY:
        print("SendGrid API key not configured")
        return False
    
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #d4a574;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You requested to reset your password for your NewsScope account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" 
                       style="background-color: #d4a574; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="background-color: #f4f4f4; padding: 10px; word-break: break-all;">
                    {reset_link}
                </p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">
                    This is an automated email from NewsScope. Please do not reply to this email.
                </p>
            </div>
        </body>
    </html>
    """
    
    try:
        message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=email,
            subject='Reset Your NewsScope Password',
            html_content=html_content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code in [200, 201, 202]
    except Exception as e:
        print(f"Error sending reset email: {str(e)}")
        return False

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not all(k in data for k in ['email', 'password', 'name']):
            return jsonify({
                'success': False,
                'error': 'Missing required fields',
                'message': 'Please provide email, password, and name'
            }), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        name = data['name'].strip()
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'error': 'Invalid email',
                'message': 'Please provide a valid email address'
            }), 400
        
        # Validate password strength
        if len(password) < 6:
            return jsonify({
                'success': False,
                'error': 'Weak password',
                'message': 'Password must be at least 6 characters long'
            }), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'User exists',
                'message': 'An account with this email already exists'
            }), 409
        
        # Create new user
        new_user = User(email=email, name=name)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        # Log the user in
        session['user_id'] = new_user.id
        session.permanent = True
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Signup error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': 'An error occurred during registration'
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['email', 'password']):
            return jsonify({
                'success': False,
                'error': 'Missing credentials',
                'message': 'Please provide email and password'
            }), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({
                'success': False,
                'error': 'Invalid credentials',
                'message': 'Invalid email or password'
            }), 401
        
        if not user.is_active:
            return jsonify({
                'success': False,
                'error': 'Account disabled',
                'message': 'Your account has been disabled'
            }), 403
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create session
        session['user_id'] = user.id
        session.permanent = True
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': 'An error occurred during login'
        }), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User logout endpoint"""
    # Clear session regardless of authentication status
    session.clear()
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current user information"""
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Server error'
        }), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({
                'success': False,
                'error': 'Email required',
                'message': 'Please provide your email address'
            }), 400
        
        email = data['email'].lower().strip()
        user = User.query.filter_by(email=email).first()
        
        # Always return success to prevent email enumeration
        if not user:
            return jsonify({
                'success': True,
                'message': 'If an account exists, a reset link has been sent'
            }), 200
        
        # Generate reset token
        reset_token = user.generate_reset_token()
        db.session.commit()
        
        # Send reset email
        email_sent = send_reset_email(email, reset_token)
        
        if not email_sent:
            # For development: return success with a message about email configuration
            # In production, you might want to handle this differently
            print(f"Reset token for {email}: {reset_token}")
            return jsonify({
                'success': True,
                'message': 'Password reset link generated (email not configured - check console for token)'
            }), 200
        
        return jsonify({
            'success': True,
            'message': 'Password reset link sent to your email'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Forgot password error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': 'An error occurred. Please try again.'
        }), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['token', 'password']):
            return jsonify({
                'success': False,
                'error': 'Missing data',
                'message': 'Token and new password are required'
            }), 400
        
        token = data['token']
        new_password = data['password']
        
        # Validate password
        if len(new_password) < 6:
            return jsonify({
                'success': False,
                'error': 'Weak password',
                'message': 'Password must be at least 6 characters long'
            }), 400
        
        # Find user with valid token
        user = User.query.filter_by(reset_token=token).first()
        
        if not user or not user.verify_reset_token(token):
            return jsonify({
                'success': False,
                'error': 'Invalid token',
                'message': 'Invalid or expired reset token'
            }), 400
        
        # Update password
        user.set_password(new_password)
        user.clear_reset_token()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Password reset successful'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Reset password error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': 'An error occurred. Please try again.'
        }), 500