"""
Database Migration Script for NewsScope Credit System
This script adds credit functionality to existing NewsScope database
Run this after updating models.py with credit fields
"""

import os
import sys
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def migrate_database():
    """Run database migrations"""
    conn = get_db_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return False
    
    cur = conn.cursor()
    
    try:
        print("🔄 Starting database migration for credit system...")
        print("-" * 60)
        
        # 1. Add credits columns to users table
        print("\n1️⃣  Adding credits columns to users table...")
        try:
            cur.execute("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 5 NOT NULL,
                ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0 NOT NULL;
            """)
            print("✅ Credits columns added to users table")
        except Exception as e:
            print(f"⚠️  Credits columns might already exist: {e}")
        
        # 2. Update existing users to have 5 credits if they have 0
        print("\n2️⃣  Updating existing users with default credits...")
        cur.execute("""
            UPDATE users 
            SET credits = 5, credits_used = 0 
            WHERE credits IS NULL OR credits = 0;
        """)
        updated_count = cur.rowcount
        print(f"✅ Updated {updated_count} users with default 5 credits")
        
        # 3. Create credit_transactions table
        print("\n3️⃣  Creating credit_transactions table...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS credit_transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                transaction_type VARCHAR(20) NOT NULL,
                credits_amount INTEGER NOT NULL,
                credits_before INTEGER NOT NULL,
                credits_after INTEGER NOT NULL,
                description TEXT,
                payment_id VARCHAR(100),
                order_id VARCHAR(100),
                amount_paid FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("✅ credit_transactions table created")
        
        # 4. Create index on user_id for faster queries
        print("\n4️⃣  Creating indexes on credit_transactions...")
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id 
            ON credit_transactions(user_id);
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at 
            ON credit_transactions(created_at);
        """)
        print("✅ Indexes created on credit_transactions")
        
        # 5. Create payment_orders table
        print("\n5️⃣  Creating payment_orders table...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS payment_orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                order_id VARCHAR(100) UNIQUE NOT NULL,
                amount FLOAT NOT NULL,
                currency VARCHAR(10) DEFAULT 'INR',
                credits_amount INTEGER NOT NULL,
                status VARCHAR(20) DEFAULT 'created',
                payment_id VARCHAR(100),
                payment_signature VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("✅ payment_orders table created")
        
        # 6. Create indexes on payment_orders
        print("\n6️⃣  Creating indexes on payment_orders...")
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id 
            ON payment_orders(user_id);
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id 
            ON payment_orders(order_id);
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_payment_orders_created_at 
            ON payment_orders(created_at);
        """)
        print("✅ Indexes created on payment_orders")
        
        # Commit all changes
        conn.commit()
        
        print("\n" + "=" * 60)
        print("✅ DATABASE MIGRATION COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        
        # Display summary
        print("\n📊 Migration Summary:")
        print(f"   • Credits system enabled for all users")
        print(f"   • {updated_count} existing users credited with 5 free credits")
        print(f"   • credit_transactions table created")
        print(f"   • payment_orders table created")
        print(f"   • All necessary indexes created")
        
        # Display current user count and credits
        cur.execute("SELECT COUNT(*) as count, SUM(credits) as total_credits FROM users;")
        stats = cur.fetchone()
        print(f"\n📈 Current Statistics:")
        print(f"   • Total users: {stats['count']}")
        print(f"   • Total credits in system: {stats['total_credits']}")
        
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        conn.rollback()
        cur.close()
        conn.close()
        return False

def rollback_migration():
    """Rollback migration (optional - use with caution)"""
    conn = get_db_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return False
    
    cur = conn.cursor()
    
    try:
        print("⚠️  WARNING: Rolling back credit system migration...")
        print("This will remove all credit-related tables and columns!")
        response = input("Are you sure you want to continue? (yes/no): ")
        
        if response.lower() != 'yes':
            print("❌ Rollback cancelled")
            return False
        
        print("\n🔄 Rolling back...")
        
        # Drop tables
        cur.execute("DROP TABLE IF EXISTS payment_orders CASCADE;")
        cur.execute("DROP TABLE IF EXISTS credit_transactions CASCADE;")
        print("✅ Dropped credit tables")
        
        # Remove columns from users table
        cur.execute("""
            ALTER TABLE users 
            DROP COLUMN IF EXISTS credits,
            DROP COLUMN IF EXISTS credits_used;
        """)
        print("✅ Removed credit columns from users table")
        
        conn.commit()
        cur.close()
        conn.close()
        
        print("\n✅ Rollback completed successfully")
        return True
        
    except Exception as e:
        print(f"\n❌ Rollback failed: {e}")
        conn.rollback()
        cur.close()
        conn.close()
        return False

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("NewsScope Credit System - Database Migration")
    print("=" * 60)
    
    if len(sys.argv) > 1 and sys.argv[1] == 'rollback':
        rollback_migration()
    else:
        migrate_database()
    
    print("\n")
