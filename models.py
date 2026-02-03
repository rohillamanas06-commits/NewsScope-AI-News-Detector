from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    reset_token = db.Column(db.String(100), unique=True)
    reset_token_expiry = db.Column(db.DateTime)
    
    # Credit system fields
    credits = db.Column(db.Integer, default=5, nullable=False)  # Default 5 free credits
    credits_used = db.Column(db.Integer, default=0, nullable=False)
    
    # Relationship with analysis history
    analyses = db.relationship('AnalysisHistory', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    # Relationship with credit transactions
    credit_transactions = db.relationship('CreditTransaction', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set the user's password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches the hash"""
        return check_password_hash(self.password_hash, password)
    
    def generate_reset_token(self):
        """Generate a password reset token"""
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        return self.reset_token
    
    def verify_reset_token(self, token):
        """Verify if the reset token is valid and not expired"""
        if self.reset_token != token:
            return False
        if self.reset_token_expiry < datetime.utcnow():
            return False
        return True
    
    def clear_reset_token(self):
        """Clear the reset token after use"""
        self.reset_token = None
        self.reset_token_expiry = None
    
    def to_dict(self):
        """Convert user to dictionary (without sensitive data)"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'credits': self.credits,
            'credits_used': self.credits_used
        }


class CreditTransaction(db.Model):
    __tablename__ = 'credit_transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    transaction_type = db.Column(db.String(20), nullable=False)  # 'purchase', 'deduct', 'refund'
    credits_amount = db.Column(db.Integer, nullable=False)
    credits_before = db.Column(db.Integer, nullable=False)
    credits_after = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    payment_id = db.Column(db.String(100))
    order_id = db.Column(db.String(100))
    amount_paid = db.Column(db.Float)  # Amount in rupees
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert transaction to dictionary"""
        return {
            'id': self.id,
            'transaction_type': self.transaction_type,
            'credits_amount': self.credits_amount,
            'credits_before': self.credits_before,
            'credits_after': self.credits_after,
            'description': self.description,
            'payment_id': self.payment_id,
            'order_id': self.order_id,
            'amount_paid': self.amount_paid,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class PaymentOrder(db.Model):
    __tablename__ = 'payment_orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    order_id = db.Column(db.String(100), unique=True, nullable=False)
    amount = db.Column(db.Float, nullable=False)  # Amount in rupees
    currency = db.Column(db.String(10), default='INR')
    credits_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='created')  # created, paid, failed
    payment_id = db.Column(db.String(100))
    payment_signature = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert order to dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'amount': self.amount,
            'currency': self.currency,
            'credits_amount': self.credits_amount,
            'status': self.status,
            'payment_id': self.payment_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class AnalysisHistory(db.Model):
    __tablename__ = 'analysis_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    headline = db.Column(db.Text)
    news_text = db.Column(db.Text, nullable=False)
    verdict = db.Column(db.String(20), nullable=False)
    confidence = db.Column(db.Integer, nullable=False)
    summary = db.Column(db.Text)
    detailed_analysis = db.Column(db.Text)
    red_flags = db.Column(db.JSON)
    key_claims = db.Column(db.JSON)
    sources_checked = db.Column(db.JSON)
    
    def to_dict(self):
        """Convert analysis to dictionary"""
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'headline': self.headline,
            'news_text': self.news_text[:200] + '...' if len(self.news_text) > 200 else self.news_text,
            'verdict': self.verdict,
            'confidence': self.confidence,
            'summary': self.summary,
            'detailed_analysis': self.detailed_analysis,
            'red_flags': self.red_flags,
            'key_claims': self.key_claims,
            'sources_checked': self.sources_checked
        }