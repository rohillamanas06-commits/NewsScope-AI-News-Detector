#!/usr/bin/env python3
"""
Migration script to add missing columns to the users table
"""

import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

def check_table_schema():
    """Check the current table schema"""
    with app.app_context():
        try:
            print("Current users table schema:")
            result = db.session.execute(db.text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'users'
                ORDER BY ordinal_position
            """)).fetchall()
            
            for row in result:
                print(f"  {row[0]}: {row[1]} (nullable: {row[2]}, default: {row[3]})")
            
        except Exception as e:
            print(f"❌ Schema check failed: {str(e)}")
            raise

if __name__ == "__main__":
    check_table_schema()
