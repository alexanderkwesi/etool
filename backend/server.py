"""
ETool Unified Flask Backend Server
===================================
Consolidates: LoginServer.py, MemberLogin.py, ServerLogin.py, payment.py, ServerDashboard.py
Serves all API endpoints on port 5000.
"""

import sys
import os
import pkgutil
import hashlib
import secrets
import sqlite3
import logging
from datetime import datetime, timedelta, timezone
import shutil
import uuid

# Python 3.14 compatibility fix
# Instead of: pkgutil.get_loader = importlib.find_loader
import importlib.util
pkgutil.get_loader = lambda name: None if name == "__main__" else (lambda s: s.loader if s else None)(importlib.util.find_spec(name))
import pkgutil

# Patch for Python 3.12+ compatibility (find_loader was removed)
if not hasattr(importlib, 'find_loader'):
    def _find_loader_shim(name, path=None):
        spec = importlib.util.find_spec(name)
        if spec is None:
            return None
        return spec.loader
    importlib.find_loader = _find_loader_shim

from flask import Flask, redirect, request, jsonify, session, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
from sqlalchemy import (
    create_engine, Column, Integer, String, DateTime,
    Boolean, ForeignKey, Text, Float
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from dotenv import load_dotenv

# ─────────────────────────────────────────────────
# ENV & LOGGING
# ─────────────────────────────────────────────────
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PAYPAL_CLIENT_ID     = os.getenv('PAYPAL_CLIENT_ID', '')
PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET', '')
PAYPAL_MODE          = os.getenv('PAYPAL_MODE', 'sandbox')
GOOGLE_CLIENT_ID     = os.getenv('REACT_APP_GOOGLE_CLIENT_ID', '')

# ─────────────────────────────────────────────────
# DATABASE SETUP
# ─────────────────────────────────────────────────
#DB_PATH = os.path.join(os.path.dirname(__file__), '/backend/server', 'engineering_tools.db')
DATABASE_URL = f'sqlite:///./backend/server/engineering_tools.db'
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
Base = declarative_base()
DBSession = sessionmaker(bind=engine)

# ─────────────────────────────────────────────────
# MODELS
# ─────────────────────────────────────────────────
class SubscriptionPlan(Base):
    __tablename__ = 'subscription_plans'
    id            = Column(Integer, primary_key=True)
    name          = Column(String(100), nullable=False)
    description   = Column(Text, nullable=True)
    price         = Column(String(50), nullable=False, default='0')
    billing_cycle = Column(String(50), nullable=False, default='monthly')
    duration_days = Column(Integer, nullable=False, default=30)
    max_users     = Column(Integer, default=1)
    total_features= Column(Integer, default=5)
    features      = Column(Text, nullable=True)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    updated_at    = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None), onupdate=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

    user_members        = relationship("UserMember", back_populates="subscription_plan")
    user_google_members = relationship("UserGoogleMember", back_populates="subscription_plan")

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'description': self.description,
            'price': self.price, 'billing_cycle': self.billing_cycle,
            'duration_days': self.duration_days, 'max_users': self.max_users,
            'total_features': self.total_features, 'features': self.features,
            'is_active': self.is_active,
        }


class UserCategory(Base):
    __tablename__ = 'user_categories'
    id            = Column(Integer, primary_key=True)
    company_name  = Column(String(255))
    job_title     = Column(String(255))
    userType      = Column(String(50))
    purpose       = Column(String(255))
    teamSize      = Column(Integer)
    member_firstname = Column(String(255))
    member_lastname  = Column(String(255))
    member_email     = Column(String(255))
    google_name      = Column(String(255))
    google_email     = Column(String(255))
    user_members_id        = Column(Integer, ForeignKey('user_members.id'),        nullable=True)
    user_google_members_id = Column(Integer, ForeignKey('user_google_member.id'),  nullable=True)
    is_email_verified = Column(Boolean, default=False)
    is_active         = Column(Boolean, default=True)
    created_at        = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    updated_at        = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None), onupdate=lambda: datetime.now(timezone.utc).replace(tzinfo=None))


class UserMember(Base):
    __tablename__ = 'user_members'
    id                   = Column(Integer, primary_key=True)
    email                = Column(String(150), nullable=False, unique=True)
    password_hash        = Column(String(255), nullable=False)
    first_name           = Column(String(100), nullable=False)
    last_name            = Column(String(100), nullable=False)
    subscription_plan_id = Column(Integer, ForeignKey('subscription_plans.id'), nullable=True, default=1)
    user_category_id     = Column(Integer, ForeignKey('user_categories.id'),    nullable=True)
    is_active            = Column(Boolean, default=True)
    is_verified          = Column(Boolean, default=False)
    last_login           = Column(DateTime, nullable=True)
    created_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    updated_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None), onupdate=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

    subscription_plan = relationship("SubscriptionPlan", back_populates="user_members")
    user_categories   = relationship("UserCategory",
                                     primaryjoin="UserMember.id == UserCategory.user_members_id",
                                     foreign_keys=[UserCategory.user_members_id])

    def to_dict(self):
        plan = self.subscription_plan
        return {
            'id': self.id, 'email': self.email,
            'first_name': self.first_name, 'last_name': self.last_name,
            'subscription_plan_id': self.subscription_plan_id,
            'subscription_plan_name': plan.name if plan else 'Basic',
            'is_verified': bool(self.is_verified),
            'is_active': bool(self.is_active),
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class UserGoogleMember(Base):
    __tablename__ = 'user_google_member'
    id                   = Column(Integer, primary_key=True)
    google_id            = Column(String(255), unique=True, nullable=True)
    email                = Column(String(255), unique=True, nullable=False)
    first_name           = Column(String(100), nullable=False)
    last_name            = Column(String(100), nullable=False)
    display_name         = Column(String(255), nullable=True)
    avatar               = Column(String(500), nullable=True)
    auth_method          = Column(String(50), default='google')
    subscription_plan_id = Column(Integer, ForeignKey('subscription_plans.id'), nullable=True, default=1)
    user_category_id     = Column(Integer, ForeignKey('user_categories.id'),    nullable=True)
    is_active            = Column(Boolean, default=True)
    is_verified          = Column(Boolean, default=False)
    last_login           = Column(DateTime, nullable=True)
    created_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    updated_at           = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None), onupdate=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

    subscription_plan = relationship("SubscriptionPlan", back_populates="user_google_members")

    def to_dict(self):
        plan = self.subscription_plan
        return {
            'id': self.id, 'email': self.email,
            'first_name': self.first_name, 'last_name': self.last_name,
            'display_name': self.display_name, 'avatar': self.avatar,
            'auth_method': self.auth_method,
            'subscription_plan_name': plan.name if plan else 'Basic',
            'is_verified': bool(self.is_verified),
            'is_active': bool(self.is_active),
        }




# ─────────────────────────────────────────────────
# DOCUMENT MODELS
# ─────────────────────────────────────────────────
class DocumentOwner(Base):
    __tablename__ = 'document_owners'
    id                = Column(Integer, primary_key=True, autoincrement=True)
    document_manager  = Column(String(255), nullable=False)   # email of manager
    document_owner    = Column(String(255), nullable=False)   # email of owner
    document_modifier = Column(String(255), nullable=False, default='')  # email who last modified
    team_members      = Column(Text, nullable=True)           # JSON list of member emails
    date_used         = Column(DateTime, nullable=True)
    date_modified     = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None), onupdate=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    action            = Column(String(100), default='created') # created|updated|downloaded|deleted

    documents = relationship("Document", back_populates="owner_record",
                             cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id':                self.id,
            'document_manager':  self.document_manager,
            'document_owner':    self.document_owner,
            'document_modifier': self.document_modifier,
            'team_members':      self.team_members,
            'date_used':         self.date_used.isoformat() if self.date_used else None,
            'date_modified':     self.date_modified.isoformat() if self.date_modified else None,
            'action':            self.action,
        }


class Document(Base):
    __tablename__ = 'documents'
    id                      = Column(Integer, primary_key=True, autoincrement=True)
    document_name           = Column(String(500), nullable=False)
    document_type           = Column(String(50),  nullable=False)
    document_size           = Column(Float,        nullable=True)   # MB
    modified_document_name  = Column(String(500),  nullable=True)
    modified_document_type  = Column(String(50),   nullable=True)
    modified_document_size  = Column(Float,        nullable=True)   # MB
    date_initialised        = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    action                  = Column(String(100), default='uploaded')  # uploaded|converted|downloaded|deleted
    document_owners_id      = Column(Integer, ForeignKey('document_owners.id'), nullable=False)

    owner_record = relationship("DocumentOwner", back_populates="documents")

    def to_dict(self):
        return {
            'id':                     self.id,
            'document_name':          self.document_name,
            'document_type':          self.document_type,
            'document_size':          self.document_size,
            'modified_document_name': self.modified_document_name,
            'modified_document_type': self.modified_document_type,
            'modified_document_size': self.modified_document_size,
            'date_initialised':       self.date_initialised.isoformat() if self.date_initialised else None,
            'action':                 self.action,
            'document_owners_id':     self.document_owners_id,
        }


# ─────────────────────────────────────────────────
# USER STORED FILE MODEL  (viewer/editor saves)
# ─────────────────────────────────────────────────
class UserStoredFile(Base):
    __tablename__ = 'user_stored_files'
    id          = Column(Integer, primary_key=True, autoincrement=True)
    user_id     = Column(Integer, ForeignKey('user_members.id'), nullable=False)
    file_name   = Column(String(500), nullable=False)
    file_type   = Column(String(100), nullable=True)
    file_size   = Column(Integer, nullable=True)          # bytes
    content     = Column(Text, nullable=True)             # text content (may be encrypted)
    is_encrypted= Column(Boolean, default=False)
    saved_at    = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    last_modified = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
                           onupdate=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

    def to_dict(self):
        return {
            'id':           self.id,
            'name':         self.file_name,
            'type':         self.file_type,
            'size':         self.file_size,
            'isEncrypted':  bool(self.is_encrypted),
            'lastModified': self.last_modified.isoformat() if self.last_modified else None,
            'savedAt':      self.saved_at.isoformat() if self.saved_at else None,
        }


# ─────────────────────────────────────────────────
# FILE CONVERSION CONFIG
# ─────────────────────────────────────────────────
_BACKEND_DIR     = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER    = os.path.join(_BACKEND_DIR, "uploads", "conversions")
CONVERTED_FOLDER = os.path.join(_BACKEND_DIR, "converted")
os.makedirs(UPLOAD_FOLDER,    exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {
    "dwg", "dxf", "dgn",
    "step", "iges", "stl", "obj",
    "pdf", "svg", "png", "jpg", "jpeg",
    "dwf", "dwfx", "rvt",
}

PLAN_FILE_LIMITS = {
    "1": {"file_limit": 5,  "size_limit_mb": 10},
    "2": {"file_limit": 10, "size_limit_mb": 20},
    "3": {"file_limit": 10, "size_limit_mb": 20},
    "4": {"file_limit": 50, "size_limit_mb": 50},
    "5": {"file_limit": 50, "size_limit_mb": 50},
    "basic":    {"file_limit": 5,  "size_limit_mb": 10},
    "standard": {"file_limit": 10, "size_limit_mb": 20},
    "premium":  {"file_limit": 50, "size_limit_mb": 50},
}

def _allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def _get_plan_limits(plan_id):
    return PLAN_FILE_LIMITS.get(str(plan_id), PLAN_FILE_LIMITS["basic"])

def _simulate_convert(src_path, target_ext, out_dir):
    """Placeholder: copies file with new extension. Replace with real converter per format."""
    base     = os.path.splitext(os.path.basename(src_path))[0]
    out_name = f"{base}.{target_ext}"
    out_path = os.path.join(out_dir, out_name)
    shutil.copy2(src_path, out_path)
    return out_path

def _get_or_create_doc_owner(db, user_email):
    """Return the DocumentOwner row for this user, creating one if absent."""
    owner = db.query(DocumentOwner).filter_by(document_owner=user_email).first()
    if not owner:
        owner = DocumentOwner(
            document_manager=user_email,
            document_owner=user_email,
            document_modifier=user_email,
            action='created',
            date_used=datetime.now(timezone.utc).replace(tzinfo=None),
        )
        db.add(owner)
        db.flush()   # get owner.id without full commit
    return owner


# Create tables (safe – won't overwrite existing data)
Base.metadata.create_all(bind=engine)

# ─────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────
def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    h = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"sha256${salt}${h}"

##def verify_password(stored, provided):
    if not stored:
        return False
    if not stored.startswith('sha256$'):
        return stored == provided
    try:
        _, salt, stored_hash = stored.split('$')
        return hashlib.sha256((provided + salt).encode()).hexdigest() == stored_hash
    except Exception:
        return False

def ensure_basic_plan(db_sess):
    """Return (or create) the Basic subscription plan."""
    plan = db_sess.query(SubscriptionPlan).filter_by(name="Basic").first()
    if not plan:
        plan = SubscriptionPlan(
            name="Basic", description="Free basic plan",
            price="0", billing_cycle="monthly",
            duration_days=0, max_users=1, total_features=5, is_active=True
        )
        db_sess.add(plan)
        db_sess.commit()
        db_sess.refresh(plan)
    return plan

# ─────────────────────────────────────────────────
# FLASK APP
# ─────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', secrets.token_hex(32))
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

CORS(app,
     supports_credentials=True,
     origins=["http://localhost:3000", "http://127.0.0.1:3000",
               "http://localhost:4000", "http://127.0.0.1:4000"],
     allow_headers=["Content-Type", "X-Requested-With", "Authorization"],
     expose_headers=["Set-Cookie"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])


# ═══════════════════════════════════════════════════════════
# AUTH ENDPOINTS
# ═══════════════════════════════════════════════════════════

@app.route('/api/login', methods=['POST'])
def login():
    """Email/password login."""
    try:
        data = request.get_json() or {}
        email    = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not email or not password:
            return jsonify({'status': 400, 'error': 'Email and password are required'}), 400
        if '@' not in email:
            return jsonify({'status': 400, 'error': 'Invalid email format'}), 400
        session['password_hash'] = password
        db = DBSession()
        try:
            user = db.query(UserMember).filter_by(email=email).first()
            if not user or not verify_password(user.password_hash, password):
                return jsonify({'status': 401, 'error': 'Invalid credentials',
                                'message': 'Invalid email or password'}), 401
            if not user.is_active:
                return jsonify({'status': 403, 'error': 'Account deactivated'}), 403

            user.last_login = datetime.now(timezone.utc).replace(tzinfo=None)
            db.commit()
            db.refresh(user)

            session.clear()
            session.permanent = True
            session['user_id']         = user.id
            session['email']           = user.email
            session['first_name']      = user.first_name
            session['last_name']       = user.last_name
            session['is_authenticated']= True
            plan = user.subscription_plan
            session['subscription_plan_name'] = plan.name if plan else 'Basic'

            return jsonify({
                'status': 200, 'success': True,
                'message': 'Login successful',
                'user': user.to_dict(),
                'redirect': '/dashboard'
            }), 200
        finally:
            db.close()

    except Exception as e:
        logger.exception("Login error")
        return jsonify({'status': 500, 'error': 'Internal server error', 'message': str(e)}), 500


@app.route('/api/signup', methods=['POST'])
def signup():
    """Register a new email/password user."""
    try:
        data       = request.get_json() or {}
        email      = (data.get('email') or '').strip().lower()
        password   = data.get('password') or ''
        first_name = (data.get('firstName') or data.get('first_name') or '').strip()
        last_name  = (data.get('lastName')  or data.get('last_name')  or '').strip()

        if not all([email, password, first_name, last_name]):
            return jsonify({'status': 400, 'error': 'All fields are required'}), 400
        if len(password) < 6:
            return jsonify({'status': 400, 'error': 'Password must be at least 6 characters'}), 400

        db = DBSession()
        try:
            if db.query(UserMember).filter_by(email=email).first():
                return jsonify({'status': 409, 'error': 'Email already registered'}), 409

            plan = ensure_basic_plan(db)
            user = UserMember(
                email=email, password_hash=hash_password(password),
                first_name=first_name, last_name=last_name,
                subscription_plan_id=plan.id,
                is_active=True, is_verified=False
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            return jsonify({
                'status': 201, 'message': 'Signup successful',
                'user': user.to_dict()
            }), 201
        finally:
            db.close()

    except Exception as e:
        logger.exception("Signup error")
        return jsonify({'status': 500, 'error': 'Internal server error', 'message': str(e)}), 500


@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'status': 200, 'message': 'Logged out successfully', redirect: '/login'}), 200


@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user': {
                'id':         session.get('user_id'),
                'email':      session.get('email'),
                'first_name': session.get('first_name'),
                'last_name':  session.get('last_name'),
                'subscription_plan_name': session.get('subscription_plan_name', 'Basic'),
            }
        }), 200
    return jsonify({'authenticated': False}), 401


# ─────────────────────────────────────────────────
# GOOGLE OAUTH CALLBACK
# ─────────────────────────────────────────────────
@app.route('/api/auth/google/callback', methods=['POST'])
def google_callback():
    """
    Receive Google user info from the frontend (after the browser-side
    OAuth flow) and create/login the user.
    Expects JSON: { googleId, email, firstName, lastName, displayName, avatar, accessToken }
    """
    try:
        data         = request.get_json() or {}
        google_id    = data.get('googleId') or data.get('sub') or ''
        email        = (data.get('email') or '').strip().lower()
        first_name   = data.get('firstName') or data.get('given_name') or ''
        last_name    = data.get('lastName')  or data.get('family_name') or ''
        display_name = data.get('displayName') or data.get('name') or f"{first_name} {last_name}"
        avatar       = data.get('avatar') or data.get('picture') or ''

        if not email:
            return jsonify({'status': 400, 'error': 'Email is required'}), 400

        db = DBSession()
        try:
            user = db.query(UserGoogleMember).filter_by(email=email).first()
            if not user:
                plan = ensure_basic_plan(db)
                user = UserGoogleMember(
                    google_id=google_id, email=email,
                    first_name=first_name, last_name=last_name,
                    display_name=display_name, avatar=avatar,
                    subscription_plan_id=plan.id,
                    is_active=True, is_verified=True,
                    auth_method='google'
                )
                db.add(user)
            else:
                user.last_login   = datetime.now(timezone.utc).replace(tzinfo=None)
                user.display_name = display_name or user.display_name
                user.avatar       = avatar or user.avatar

            db.commit()
            db.refresh(user)

            session.clear()
            session.permanent = True
            session['user_id']          = user.id
            session['email']            = user.email
            session['first_name']       = user.first_name
            session['last_name']        = user.last_name
            session['is_authenticated'] = True
            session['auth_method']      = 'google'
            session['subscription_plan_name'] = (
                user.subscription_plan.name if user.subscription_plan else 'Basic'
            )

            return jsonify({
                'status': 200, 'success': True,
                'message': 'Google login successful',
                'user': user.to_dict(),
                'redirect': '/dashboard'
            }), 200
        finally:
            db.close()

    except Exception as e:
        logger.exception("Google auth error")
        return jsonify({'status': 500, 'error': 'Internal server error', 'message': str(e)}), 500


# ═══════════════════════════════════════════════════════════
# USER / CATEGORY SETUP
# ═══════════════════════════════════════════════════════════

@app.route('/api/verify-category-setup', methods=['GET'])
def verify_category_setup():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'authenticated': False, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        cat = db.query(UserCategory).filter_by(
            user_members_id=session['user_id']
        ).first()
        complete = cat is not None
        return jsonify({
            'status': 200,
            'category_setup_complete': complete,
            'message': 'Setup complete' if complete else 'Category setup required',
        }), 200
    finally:
        db.close()


@app.route('/api/user/category-setup', methods=['POST'])
def save_category_setup():
    """Save the user's professional category details."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    data = request.get_json() or {}
    db   = DBSession()
    try:
        user = db.query(UserMember).filter_by(id=session['user_id']).first()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        cat = db.query(UserCategory).filter_by(user_members_id=user.id).first()
        if not cat:
            cat = UserCategory(
                user_members_id=user.id,
                member_firstname=user.first_name,
                member_lastname=user.last_name,
                member_email=user.email,
            )
            db.add(cat)

        cat.company_name = data.get('companyName', cat.company_name)
        cat.job_title    = data.get('jobTitle',    cat.job_title)
        cat.userType     = data.get('userType',    cat.userType)
        cat.purpose      = data.get('purpose',     cat.purpose)
        cat.teamSize     = data.get('teamSize',    cat.teamSize)
        db.commit()

        return jsonify({'status': 200, 'message': 'Category setup saved', 'complete': True}), 200
    except Exception as e:
        db.rollback()
        logger.exception("Category setup error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        user = db.query(UserMember).filter_by(id=session['user_id']).first()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404
        return jsonify({'status': 200, 'user': user.to_dict()}), 200
    finally:
        db.close()


# ═══════════════════════════════════════════════════════════
# SUBSCRIPTION PLANS
# ═══════════════════════════════════════════════════════════

@app.route('/api/plans', methods=['GET'])
def get_plans():
    db = DBSession()
    try:
        plans = db.query(SubscriptionPlan).filter_by(is_active=True).all()
        return jsonify({'status': 200, 'plans': [p.to_dict() for p in plans]}), 200
    finally:
        db.close()


@app.route('/api/create-subscription', methods=['POST'])
def create_subscription():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    data     = request.get_json() or {}
    plan_id  = data.get('plan_id')
    plan_name= (data.get('name') or '').strip()
    billing  = (data.get('billingCycle') or 'monthly').strip().lower()

    if not plan_id:
        return jsonify({'status': 400, 'error': 'plan_id is required'}), 400

    db = DBSession()
    try:
        plan = db.query(SubscriptionPlan).filter_by(id=plan_id).first()
        if not plan:
            return jsonify({'status': 404, 'error': 'Plan not found'}), 404

        user = db.query(UserMember).filter_by(id=session['user_id']).first()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        user.subscription_plan_id = plan.id
        db.commit()

        session['subscription_plan_name'] = plan.name

        return jsonify({
            'status': 200, 'message': 'Subscription updated',
            'plan': plan.to_dict()
        }), 200
    except Exception as e:
        db.rollback()
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


# ═══════════════════════════════════════════════════════════
# PAYPAL PAYMENT ENDPOINTS
# ═══════════════════════════════════════════════════════════

@app.route('/api/paypal/config', methods=['GET'])
def paypal_config():
    """Return the PayPal client-id to the frontend."""
    return jsonify({
        'clientId': PAYPAL_CLIENT_ID,
        'mode': PAYPAL_MODE,
    }), 200


@app.route('/api/paypal/create-order', methods=['POST'])
def paypal_create_order():
    """Create a PayPal order (v2 Orders API via paypalrestsdk or manual HTTP)."""
    try:
        data     = request.get_json() or {}
        amount   = str(data.get('amount', '0.00'))
        currency = data.get('currency', 'USD')
        desc     = data.get('description', 'ETool Subscription')

        # Try paypalrestsdk if available
        try:
            import paypalrestsdk
            paypalrestsdk.configure({
                "mode": PAYPAL_MODE,
                "client_id": PAYPAL_CLIENT_ID,
                "client_secret": PAYPAL_CLIENT_SECRET,
            })
            payment = paypalrestsdk.Payment({
                "intent": "sale",
                "payer": {"payment_method": "paypal"},
                "redirect_urls": {
                    "return_url": data.get('return_url', 'http://localhost:3000/payment/success'),
                    "cancel_url": data.get('cancel_url', 'http://localhost:3000/payment/cancel'),
                },
                "transactions": [{
                    "amount": {"total": amount, "currency": currency},
                    "description": desc,
                }],
            })
            if payment.create():
                approval_url = next(
                    (link.href for link in payment.links if link.rel == 'approval_url'),
                    None
                )
                return jsonify({
                    'status': 200, 'payment_id': payment.id,
                    'approval_url': approval_url
                }), 200
            else:
                return jsonify({'status': 400, 'error': payment.error}), 400

        except ImportError:
            # paypalrestsdk not installed – return mock for development
            return jsonify({
                'status': 200,
                'payment_id': f"MOCK-{secrets.token_hex(8)}",
                'approval_url': None,
                'message': 'PayPal SDK not installed – running in mock mode',
            }), 200

    except Exception as e:
        logger.exception("PayPal create-order error")
        return jsonify({'status': 500, 'error': str(e)}), 500


@app.route('/api/paypal/execute-payment', methods=['POST'])
def paypal_execute_payment():
    """Execute (capture) a previously created PayPal payment."""
    try:
        data       = request.get_json() or {}
        payment_id = data.get('payment_id') or data.get('paymentID')
        payer_id   = data.get('payer_id')   or data.get('payerID')

        if not payment_id or not payer_id:
            return jsonify({'status': 400, 'error': 'payment_id and payer_id are required'}), 400

        try:
            import paypalrestsdk
            paypalrestsdk.configure({
                "mode": PAYPAL_MODE,
                "client_id": PAYPAL_CLIENT_ID,
                "client_secret": PAYPAL_CLIENT_SECRET,
            })
            payment = paypalrestsdk.Payment.find(payment_id)
            if payment.execute({"payer_id": payer_id}):
                return jsonify({'status': 200, 'message': 'Payment executed', 'payment': {
                    'id': payment.id, 'state': payment.state
                }}), 200
            else:
                return jsonify({'status': 400, 'error': payment.error}), 400

        except ImportError:
            return jsonify({
                'status': 200, 'message': 'Mock payment executed',
                'payment': {'id': payment_id, 'state': 'approved'}
            }), 200

    except Exception as e:
        logger.exception("PayPal execute error")
        return jsonify({'status': 500, 'error': str(e)}), 500


@app.route('/api/paypal/verify-payment', methods=['POST'])
def paypal_verify_payment():
    data       = request.get_json() or {}
    payment_id = data.get('paymentID') or data.get('payment_id')
    return jsonify({'status': 200, 'verified': True, 'payment_id': payment_id}), 200


# ═══════════════════════════════════════════════════════════
# DASHBOARD
# ═══════════════════════════════════════════════════════════

PLAN_STORAGE_MB = {
    "1": 1024,  "basic":    1024,
    "2": 2560,  "standard": 2560,
    "3": 2560,
    "4": 5120,  "premium":  5120,
    "5": 5120,
}

PLAN_FILE_LIMITS_DASH = {
    "1": 5,  "basic":    5,
    "2": 10, "standard": 10,
    "3": 10,
    "4": 50, "premium":  50,
    "5": 50,
}

PLAN_PERMISSIONS = {
    "1": {"team_access": False, "admin_features": False},
    "2": {"team_access": True,  "admin_features": False},
    "3": {"team_access": True,  "admin_features": False},
    "4": {"team_access": True,  "admin_features": True},
    "5": {"team_access": True,  "admin_features": True},
    "basic":    {"team_access": False, "admin_features": False},
    "standard": {"team_access": True,  "admin_features": False},
    "premium":  {"team_access": True,  "admin_features": True},
}

PLAN_ID_TO_KEY = {
    "1": "basic", "2": "standard", "3": "standard",
    "4": "premium", "5": "premium",
}


@app.route('/api/dashboard/stats', methods=['GET'])
def dashboard_stats():
    """
    GET /api/dashboard/stats
    Returns usage stats (filesUsed, storageUsed, conversionsThisMonth),
    plan info, and permissions — all in one call for the dashboard header + stat cards.
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    user_id = session['user_id']
    db = DBSession()
    try:
        user = db.query(UserMember).filter(UserMember.id == user_id).scalar()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        plan_id     = str(user.subscription_plan_id or '1')
        plan_key    = PLAN_ID_TO_KEY.get(plan_id, 'basic')
        plan        = user.subscription_plan
        permissions = PLAN_PERMISSIONS.get(plan_key, PLAN_PERMISSIONS['basic'])

        # ── Pull real stats from Document / DocumentOwner tables ──
        now         = datetime.now(timezone.utc).replace(tzinfo=None)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        owner = db.query(DocumentOwner).filter_by(document_owner=user.email).first()
        owner_id = owner.id if owner else -1

        all_docs = (db.query(Document)
                      .filter(Document.document_owners_id == owner_id)
                      .all()) if owner_id != -1 else []

        month_docs = [d for d in all_docs
                      if d.date_initialised and d.date_initialised >= month_start]

        files_used             = len([d for d in month_docs if d.action == 'uploaded'])
        conversions_this_month = len([d for d in month_docs if d.action == 'converted'])

        # Storage = sum of original + converted sizes stored in DB
        storage_used_mb = round(
            sum((d.document_size or 0) + (d.modified_document_size or 0) for d in all_docs),
            2
        )

        storage_limit = PLAN_STORAGE_MB.get(plan_key, 1024)
        file_limit    = PLAN_FILE_LIMITS_DASH.get(plan_key, 5)

        price_val = 0.0
        is_annual = False
        if plan:
            try:
                price_val = float(plan.price)
            except (ValueError, TypeError):
                price_val = 0.0
            is_annual = plan.billing_cycle == 'annual'

        return jsonify({
            'status': 200,
            'stats': {
                'filesUsed':            files_used,
                'fileLimit':            file_limit,
                'storageUsed':          storage_used_mb,
                'storageLimit':         storage_limit,
                'conversionsThisMonth': conversions_this_month,
                'totalUsers':           db.query(UserMember).count(),
                'activePlans':          db.query(SubscriptionPlan).filter_by(is_active=True).count(),
            },
            'plan': {
                'id':           plan_id,
                'planId':       plan_key,
                'key':          plan_key,
                'name':         plan.name if plan else 'Begin Plan',
                'planName':     plan.name if plan else 'Begin Plan',
                'price':        plan.price if plan else '0',
                'monthlyPrice': price_val if not is_annual else round(price_val / 12, 2),
                'annualPrice':  price_val if is_annual else round(price_val * 12, 2),
                'billingCycle': plan.billing_cycle if plan else 'monthly',
                'features':     plan.features if plan else '',
                'limits': {
                    'fileLimit':     file_limit,
                    'fileSizeLimit': PLAN_FILE_LIMITS.get(plan_id, {}).get('size_limit_mb', 10),
                    'storage':       storage_limit,
                },
            },
            'permissions': permissions,
            'user': {
                'id':         user.id,
                'email':      user.email,
                'first_name': user.first_name,
                'last_name':  user.last_name,
                'is_verified': bool(user.is_verified),
                'is_active':  bool(user.is_active),
            },
        }), 200

    except Exception as e:
        logger.exception("Dashboard stats error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/dashboard/activity', methods=['GET'])
def dashboard_activity():
    """
    GET /api/dashboard/activity?limit=10
    Returns recent file conversion activity for the activity feed.
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    limit   = min(int(request.args.get('limit', 10)), 50)
    db      = DBSession()
    try:
        user = db.query(UserMember).filter(UserMember.id == session['user_id']).scalar()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        owner = db.query(DocumentOwner).filter_by(document_owner=user.email).first()
        if not owner:
            return jsonify({'status': 200, 'activity': [], 'total': 0}), 200

        docs = (db.query(Document)
                  .filter(Document.document_owners_id == owner.id)
                  .order_by(Document.date_initialised.desc())
                  .limit(limit).all())

        activity = []
        for d in docs:
            if d.action == 'converted' and d.modified_document_name:
                desc = f"Converted {d.document_name} to {(d.modified_document_type or '').upper()}"
            elif d.action == 'downloaded':
                desc = f"Downloaded {d.modified_document_name or d.document_name}"
            elif d.action == 'deleted':
                desc = f"Deleted {d.document_name}"
            else:
                desc = f"Uploaded {d.document_name}"

            activity.append({
                'id':              d.id,
                'action':          d.action,
                'description':     desc,
                'original_name':   d.document_name,
                'original_format': d.document_type,
                'converted_name':  d.modified_document_name,
                'target_format':   d.modified_document_type,
                'size_mb':         d.document_size,
                'converted_size_mb': d.modified_document_size,
                'status':          'completed',
                'timestamp':       d.date_initialised.isoformat() if d.date_initialised else None,
            })

        return jsonify({'status': 200, 'activity': activity, 'total': len(activity)}), 200
    finally:
        db.close()


@app.route('/api/dashboard/plan', methods=['GET'])
def dashboard_plan():
    """
    GET /api/dashboard/plan
    Returns plan data shaped exactly for setUserPlanData() in Use_Dashboard.js.
    Keys: planId, planName, monthlyPrice, annualPrice, billingCycle.
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        user = db.query(UserMember).filter(UserMember.id == session['user_id']).scalar()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        plan     = user.subscription_plan
        plan_id  = str(user.subscription_plan_id or '1')
        plan_key = PLAN_ID_TO_KEY.get(plan_id, 'basic')

        price_val = 0.0
        is_annual = False
        if plan:
            try:
                price_val = float(plan.price)
            except (ValueError, TypeError):
                price_val = 0.0
            is_annual = plan.billing_cycle == 'annual'

        return jsonify({
            'status': 200,
            'plan': {
                'planId':       plan_key,
                'planName':     plan.name if plan else 'Begin Plan',
                'monthlyPrice': price_val if not is_annual else round(price_val / 12, 2),
                'annualPrice':  price_val if is_annual else round(price_val * 12, 2),
                'billingCycle': plan.billing_cycle if plan else 'monthly',
                'permissions':  PLAN_PERMISSIONS.get(plan_key, PLAN_PERMISSIONS['basic']),
                'limits': {
                    'fileLimit':     PLAN_FILE_LIMITS_DASH.get(plan_key, 5),
                    'fileSizeLimit': PLAN_FILE_LIMITS.get(plan_id, {}).get('size_limit_mb', 10),
                    'storage':       PLAN_STORAGE_MB.get(plan_key, 1024),
                },
            },
        }), 200

    except Exception as e:
        logger.exception("Dashboard plan error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/dashboard/permissions', methods=['GET'])
def dashboard_permissions():
    """
    GET /api/dashboard/permissions
    Returns team_access and admin_features booleans used by hasPermission()
    in Use_Security to show/hide Compare Files, Manage Team, Role Management etc.
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        user     = db.query(UserMember).filter(UserMember.id == session['user_id']).scalar()
        plan_id  = str(user.subscription_plan_id or '1') if user else '1'
        plan_key = PLAN_ID_TO_KEY.get(plan_id, 'basic')
        perms    = PLAN_PERMISSIONS.get(plan_key, PLAN_PERMISSIONS['basic'])

        return jsonify({
            'status':      200,
            'permissions': perms,
            'plan_id':     plan_id,
            'plan_key':    plan_key,
        }), 200
    finally:
        db.close()





# ═══════════════════════════════════════════════════════════
# TEAM MEMBERS
# ═══════════════════════════════════════════════════════════

@app.route('/api/team/members', methods=['GET'])
def get_team_members():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        members = db.query(UserMember).filter_by(is_active=True).limit(50).all()
        return jsonify({'status': 200, 'members': [m.to_dict() for m in members]}), 200
    finally:
        db.close()


@app.route('/api/team/members', methods=['POST'])
def add_team_member():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    data      = request.get_json() or {}
    email     = (data.get('email') or '').strip().lower()
    first     = data.get('firstName') or data.get('first_name') or ''
    last      = data.get('lastName')  or data.get('last_name')  or ''

    if not email:
        return jsonify({'status': 400, 'error': 'Email is required'}), 400

    db = DBSession()
    try:
        if db.query(UserMember).filter_by(email=email).first():
            return jsonify({'status': 409, 'error': 'Email already exists'}), 409
        plan  = ensure_basic_plan(db)
        member = UserMember(
            email=email, password_hash=hash_password(secrets.token_hex(16)),
            first_name=first or 'New', last_name=last or 'Member',
            subscription_plan_id=plan.id, is_active=True, is_verified=False
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        return jsonify({'status': 201, 'member': member.to_dict()}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


# ═══════════════════════════════════════════════════════════
# BILLING HISTORY  (stub – extend with real payment records)
# ═══════════════════════════════════════════════════════════

@app.route('/api/billing/history', methods=['GET'])
def billing_history():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    return jsonify({'status': 200, 'history': []}), 200


# ═══════════════════════════════════════════════════════════
# FILE CONVERSION  (backed by document_owners + documents tables)
# ═══════════════════════════════════════════════════════════

@app.route('/api/files/upload', methods=['POST'])
def file_upload():
    """
    POST /api/files/upload  multipart: files[]
    Saves each file to disk, writes a Document row (action='uploaded'),
    returns metadata list.
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        user = db.query(UserMember).filter(UserMember.id == session['user_id']).scalar()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        plan_id = str(user.subscription_plan_id or '1')
        limits  = _get_plan_limits(plan_id)
        files   = request.files.getlist('files[]')

        if not files:
            return jsonify({'status': 400, 'error': 'No files provided'}), 400
        if len(files) > limits['file_limit']:
            return jsonify({'status': 400,
                            'error': f"Plan allows max {limits['file_limit']} files"}), 400

        owner     = _get_or_create_doc_owner(db, user.email)
        user_dir  = os.path.join(UPLOAD_FOLDER, str(user.id))
        os.makedirs(user_dir, exist_ok=True)

        uploaded, errors = [], []
        for file in files:
            if not file or not file.filename:
                continue
            if not _allowed_file(file.filename):
                errors.append(f"{file.filename}: unsupported format")
                continue

            file.seek(0, 2);  size_bytes = file.tell();  file.seek(0)

            if size_bytes > limits['size_limit_mb'] * 1024 * 1024:
                errors.append(f"{file.filename}: exceeds {limits['size_limit_mb']}MB")
                continue

            safe_name   = secure_filename(file.filename)
            unique_name = f"{uuid.uuid4().hex}_{safe_name}"
            save_path   = os.path.join(user_dir, unique_name)
            file.save(save_path)

            ext      = safe_name.rsplit('.', 1)[-1].lower()
            size_mb  = round(size_bytes / 1024 / 1024, 4)

            doc = Document(
                document_name=safe_name,
                document_type=ext,
                document_size=size_mb,
                action='uploaded',
                document_owners_id=owner.id,
            )
            db.add(doc)
            db.flush()

            owner.date_used     = datetime.now(timezone.utc).replace(tzinfo=None)
            owner.date_modified = datetime.now(timezone.utc).replace(tzinfo=None)
            owner.action        = 'uploaded'

            uploaded.append({
                'file_id':        unique_name,
                'document_id':    doc.id,
                'original_name':  safe_name,
                'size_bytes':     size_bytes,
                'size_mb':        size_mb,
                'extension':      ext,
                'uploaded_at':    datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
            })

        db.commit()

        if not uploaded:
            return jsonify({'status': 400, 'error': 'No valid files uploaded',
                            'details': errors}), 400

        return jsonify({'status': 200, 'uploaded': uploaded,
                        'errors': errors, 'plan_limits': limits}), 200

    except Exception as e:
        db.rollback()
        logger.exception("Upload error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/files/convert', methods=['POST'])
def file_convert():
    """
    POST /api/files/convert
    JSON: { files: [{file_id, original_name, document_id}], target_format: 'pdf' }
    Converts each file, updates Document row with modified_* fields.
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    data          = request.get_json(silent=True) or {}
    files         = data.get('files', [])
    target_format = data.get('target_format', '').lower().strip('.')

    if not files:
        return jsonify({'status': 400, 'error': 'No files provided'}), 400
    if not target_format or target_format not in ALLOWED_EXTENSIONS:
        return jsonify({'status': 400, 'error': f"Invalid format: {target_format}"}), 400

    db = DBSession()
    try:
        user = db.query(UserMember).filter(UserMember.id == session['user_id']).scalar()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        plan_id = str(user.subscription_plan_id or '1')
        limits  = _get_plan_limits(plan_id)

        if len(files) > limits['file_limit']:
            return jsonify({'status': 400,
                            'error': f"Plan allows max {limits['file_limit']} files"}), 400

        owner    = _get_or_create_doc_owner(db, user.email)
        user_dir = os.path.join(UPLOAD_FOLDER,    str(user.id))
        out_dir  = os.path.join(CONVERTED_FOLDER, str(user.id))
        os.makedirs(out_dir, exist_ok=True)

        converted, errors = [], []
        for f in files:
            file_id   = f.get('file_id', '')
            src_path  = os.path.join(user_dir, secure_filename(file_id))

            if not os.path.exists(src_path):
                errors.append(f"{file_id}: not found – upload first")
                continue

            orig_name = f.get('original_name', file_id)
            orig_ext  = file_id.rsplit('.', 1)[-1].lower() if '.' in file_id else 'unknown'

            try:
                out_path     = _simulate_convert(src_path, target_format, out_dir)
                converted_id = os.path.basename(out_path)
                out_size_mb  = round(os.path.getsize(out_path) / 1024 / 1024, 4)
                conv_name    = os.path.splitext(orig_name)[0] + f'.{target_format}'

                # Update Document row if document_id supplied, else create new
                doc_id = f.get('document_id')
                if doc_id:
                    doc = db.query(Document).filter(Document.id == doc_id).scalar()
                else:
                    doc = None

                if doc:
                    doc.modified_document_name = conv_name
                    doc.modified_document_type = target_format
                    doc.modified_document_size = out_size_mb
                    doc.action                 = 'converted'
                else:
                    doc = Document(
                        document_name=orig_name,
                        document_type=orig_ext,
                        document_size=None,
                        modified_document_name=conv_name,
                        modified_document_type=target_format,
                        modified_document_size=out_size_mb,
                        action='converted',
                        document_owners_id=owner.id,
                    )
                    db.add(doc)
                    db.flush()

                owner.document_modifier = user.email
                owner.date_modified     = datetime.now(timezone.utc).replace(tzinfo=None)
                owner.date_used         = datetime.now(timezone.utc).replace(tzinfo=None)
                owner.action            = 'converted'

                record = {
                    'id':              str(uuid.uuid4()),
                    'document_id':     doc.id,
                    'file_id':         file_id,
                    'converted_id':    converted_id,
                    'original_name':   orig_name,
                    'converted_name':  conv_name,
                    'original_format': orig_ext,
                    'target_format':   target_format,
                    'conversionType':  target_format,
                    'size_mb':         out_size_mb,
                    'converted_at':    datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
                    'timestamp':       datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
                    'status':          'completed',
                    'download_url':    f'/api/files/download/{user.id}/{converted_id}',
                }
                converted.append(record)

            except Exception as e:
                logger.error("Conversion error %s: %s", file_id, e)
                errors.append(f"{file_id}: conversion failed – {e}")

        db.commit()

        if not converted:
            return jsonify({'status': 500, 'error': 'All conversions failed',
                            'details': errors}), 500

        return jsonify({'status': 200, 'converted': converted, 'errors': errors}), 200

    except Exception as e:
        db.rollback()
        logger.exception("Convert error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/files/download/<int:user_id>/<converted_id>', methods=['GET'])
def file_download(user_id, converted_id):
    """GET /api/files/download/<user_id>/<converted_id>  – stream file, mark as downloaded."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    if session['user_id'] != user_id:
        return jsonify({'status': 403, 'error': 'Forbidden'}), 403

    out_path = os.path.join(CONVERTED_FOLDER, str(user_id), secure_filename(converted_id))
    if not os.path.exists(out_path):
        return jsonify({'status': 404, 'error': 'File not found'}), 404

    # Mark document as downloaded
    db = DBSession()
    try:
        user  = db.query(UserMember).filter(UserMember.id == user_id).scalar()
        owner = _get_or_create_doc_owner(db, user.email) if user else None
        if owner:
            doc = (db.query(Document)
                     .filter(Document.document_owners_id == owner.id,
                             Document.modified_document_name == converted_id)
                     .order_by(Document.date_initialised.desc())
                     .first())
            if doc:
                doc.action      = 'downloaded'
            owner.date_used = datetime.now(timezone.utc).replace(tzinfo=None)
            owner.action    = 'downloaded'
            db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

    return send_file(out_path, as_attachment=True, download_name=converted_id)


@app.route('/api/files/documents', methods=['GET'])
def list_documents():
    """
    GET /api/files/documents?limit=50
    Returns all Document rows for the current user with owner info.
    Used by dashboard and app page.
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    limit = min(int(request.args.get('limit', 50)), 200)
    db    = DBSession()
    try:
        user = db.query(UserMember).filter(UserMember.id == session['user_id']).scalar()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        owner = db.query(DocumentOwner).filter_by(document_owner=user.email).first()
        if not owner:
            return jsonify({'status': 200, 'documents': [], 'total': 0}), 200

        docs = (db.query(Document)
                  .filter(Document.document_owners_id == owner.id)
                  .order_by(Document.date_initialised.desc())
                  .limit(limit).all())

        return jsonify({
            'status':    200,
            'documents': [d.to_dict() for d in docs],
            'total':     len(docs),
            'owner':     owner.to_dict(),
        }), 200
    finally:
        db.close()


@app.route('/api/files/documents/<int:doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    """DELETE /api/files/documents/<doc_id>  – remove DB row and disk files."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        user = db.query(UserMember).filter(UserMember.id == session['user_id']).scalar()
        doc  = db.query(Document).filter(Document.id == doc_id).scalar()

        if not doc:
            return jsonify({'status': 404, 'error': 'Document not found'}), 404

        owner = db.query(DocumentOwner).filter(DocumentOwner.id == doc.document_owners_id).scalar()
        if not owner or owner.document_owner != user.email:
            return jsonify({'status': 403, 'error': 'Forbidden'}), 403

        # Remove disk files if they exist
        user_dir = os.path.join(UPLOAD_FOLDER,    str(user.id))
        out_dir  = os.path.join(CONVERTED_FOLDER, str(user.id))
        for directory in (user_dir, out_dir):
            for fname in (doc.document_name, doc.modified_document_name):
                if fname:
                    fp = os.path.join(directory, fname)
                    if os.path.isfile(fp):
                        os.remove(fp)

        owner.action        = 'deleted'
        owner.date_modified = datetime.now(timezone.utc).replace(tzinfo=None)
        db.delete(doc)
        db.commit()

        return jsonify({'status': 200, 'message': 'Document deleted'}), 200

    except Exception as e:
        db.rollback()
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/files/formats', methods=['GET'])
def file_formats():
    """GET /api/files/formats – mirrors supportedFormats from Use_FileConversion.js"""
    return jsonify({'status': 200, 'formats': {
        'cad':         [{'value': 'dwg',  'label': 'DWG (AutoCAD)'},
                        {'value': 'dxf',  'label': 'DXF (Drawing Exchange Format)'},
                        {'value': 'dgn',  'label': 'DGN (MicroStation)'}],
        '3d':          [{'value': 'step', 'label': 'STEP (3D Model)'},
                        {'value': 'iges', 'label': 'IGES (3D Model)'},
                        {'value': 'stl',  'label': 'STL (3D Printing)'},
                        {'value': 'obj',  'label': 'OBJ (3D Model)'}],
        '2d':          [{'value': 'pdf',  'label': 'PDF (Portable Document)'},
                        {'value': 'svg',  'label': 'SVG (Scalable Vector)'},
                        {'value': 'png',  'label': 'PNG (Raster Image)'},
                        {'value': 'jpg',  'label': 'JPG (Raster Image)'}],
        'proprietary': [{'value': 'dwf',  'label': 'DWF (Design Web Format)'},
                        {'value': 'dwfx', 'label': 'DWFX (Design Web Format X)'},
                        {'value': 'rvt',  'label': 'RVT (Revit)'}],
    }}), 200


def verify_password(stored, provided):
    if not stored:
        return False
    if not stored.startswith('sha256$'):
        return stored == provided
    try:
        _, salt, stored_hash = stored.split('$')
        computed_hash = hashlib.sha256((provided + salt).encode()).hexdigest()
        return computed_hash == stored_hash
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        return False



# ═══════════════════════════════════════════════════════════
# FILE DOWNLOAD — STORED & DATABASE FILE LISTING
# ═══════════════════════════════════════════════════════════

@app.route('/api/files/stored', methods=['GET'])
def list_stored_files():
    """
    GET /api/files/stored
    Returns all files saved by the viewer/editor for the current user.
    Content is excluded from the listing (use GET /api/files/stored/<id> to fetch content).
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        files = (db.query(UserStoredFile)
                   .filter_by(user_id=session['user_id'])
                   .order_by(UserStoredFile.last_modified.desc())
                   .all())
        return jsonify({
            'status': 200,
            'files': [f.to_dict() for f in files],
            'total': len(files),
        }), 200
    finally:
        db.close()


@app.route('/api/files/stored', methods=['POST'])
def save_stored_file():
    """
    POST /api/files/stored
    Body: { name, type, size, content, isEncrypted }
    Upserts a stored file for the current user (matched by name).
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'status': 400, 'error': 'name is required'}), 400

    db = DBSession()
    try:
        stored = (db.query(UserStoredFile)
                    .filter_by(user_id=session['user_id'], file_name=name)
                    .first())
        if stored:
            stored.file_type    = data.get('type',        stored.file_type)
            stored.file_size    = data.get('size',        stored.file_size)
            stored.content      = data.get('content',     stored.content)
            stored.is_encrypted = data.get('isEncrypted', stored.is_encrypted)
            stored.last_modified = datetime.now(timezone.utc).replace(tzinfo=None)
        else:
            stored = UserStoredFile(
                user_id     = session['user_id'],
                file_name   = name,
                file_type   = data.get('type'),
                file_size   = data.get('size'),
                content     = data.get('content'),
                is_encrypted= bool(data.get('isEncrypted', False)),
            )
            db.add(stored)

        db.commit()
        db.refresh(stored)
        return jsonify({'status': 200, 'file': stored.to_dict()}), 200

    except Exception as e:
        db.rollback()
        logger.exception("Save stored file error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/files/stored/<int:file_id>', methods=['GET'])
def get_stored_file(file_id):
    """
    GET /api/files/stored/<file_id>
    Returns full file record including content (for download).
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        stored = db.query(UserStoredFile).filter_by(
            id=file_id, user_id=session['user_id']
        ).first()
        if not stored:
            return jsonify({'status': 404, 'error': 'File not found'}), 404

        result = stored.to_dict()
        result['content'] = stored.content
        return jsonify({'status': 200, 'file': result}), 200
    finally:
        db.close()


@app.route('/api/files/stored/<int:file_id>', methods=['DELETE'])
def delete_stored_file(file_id):
    """DELETE /api/files/stored/<file_id>"""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        stored = db.query(UserStoredFile).filter_by(
            id=file_id, user_id=session['user_id']
        ).first()
        if not stored:
            return jsonify({'status': 404, 'error': 'File not found'}), 404
        db.delete(stored)
        db.commit()
        return jsonify({'status': 200, 'message': 'File deleted'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/files/db-list', methods=['GET'])
def list_db_files():
    """
    GET /api/files/db-list
    Returns the user's converted/uploaded documents shaped for Use_FileDownload.
    Each entry includes a ready-to-use download_url.
    """
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    db = DBSession()
    try:
        user = db.query(UserMember).filter(UserMember.id == session['user_id']).scalar()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404

        owner = db.query(DocumentOwner).filter_by(document_owner=user.email).first()
        if not owner:
            return jsonify({'status': 200, 'files': [], 'total': 0}), 200

        docs = (db.query(Document)
                  .filter(Document.document_owners_id == owner.id)
                  .filter(Document.action.in_(['uploaded', 'converted', 'downloaded']))
                  .order_by(Document.date_initialised.desc())
                  .limit(100).all())

        files = []
        for d in docs:
            # Prefer the converted file if available
            display_name = d.modified_document_name or d.document_name
            display_type = d.modified_document_type or d.document_type
            display_size = d.modified_document_size or d.document_size or 0
            converted_id = d.modified_document_name  # filename on disk

            files.append({
                'id':           d.id,
                'name':         display_name,
                'type':         display_type,
                'size':         int(display_size * 1024 * 1024),   # convert MB → bytes
                'action':       d.action,
                'uploadDate':   d.date_initialised.isoformat() if d.date_initialised else None,
                'download_url': f'/api/files/download/{user.id}/{converted_id}' if converted_id else None,
                'isEncrypted':  False,
            })

        return jsonify({'status': 200, 'files': files, 'total': len(files)}), 200

    except Exception as e:
        logger.exception("db-list error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


# ═══════════════════════════════════════════════════════════
# USER ACCOUNT — PASSWORD CHANGE & 2FA
# ═══════════════════════════════════════════════════════════

@app.route('/api/user/profile', methods=['GET'])
def get_profile_():
    db = DBSession()
    try:
        user_id = session.get('user_id')
        user_email  = session.get('email')
        print(session['password_hash'])
        print(user_id)
        if not user_id:
            return jsonify({'status': 401, 'error': 'Not authenticated', redirect:'/login'}), 401

        user = db.query(UserMember).filter(UserMember.id == user_id, UserMember.email == user_email).scalar()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404
        
        return jsonify({
            'status': 200,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'plan': user.plan,
                'password':session['password_hash'],
            }
        }), 200

    except Exception as e:
        logger.exception("Get profile error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


from sqlalchemy import update

@app.route('/api/user/change-password', methods=['POST'])
def change_password():
    """
    POST /api/user/change-password
    Body: { current_password, new_password }
    Verifies the current password then sets the new one.
    """
    
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401

    data             = request.get_json() or {}
    ##current_password = data.get('current_password') or data.get('currentPassword') or ''
    new_password     = data.get('new_password')     or data.get('newPassword')     or ''
    
    if not new_password:
        return jsonify({'status': 400, 'error': ' new_password are required'}), 400
    if len(new_password) < 8:
        return jsonify({'status': 400, 'error': 'New password must be at least 8 characters'}), 400

    db = DBSession()
    try:
        user = db.query(UserMember).filter_by(id=session['user_id']).first()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404
        
        if not verify_password(user.password_hash, new_password):
            return jsonify({'status': 401, 'error': 'New password cannot be the as the old password.'}), 401
        password = hash_password(new_password)
        user_password = db.query(UserMember).filter_by(id=user.id).first()

        db.execute(
            update(UserMember)
            .where(UserMember.id == user.id)
            .values(password_hash=password)
        )
        db.commit()
        logger.info("Password changed for user %s", user.email)
        return jsonify({'status': 200, 'message': 'Password changed successfully'}), 200

    except Exception as e:
        db.rollback()
        logger.exception("Change password error")
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


@app.route('/api/user/2fa/enable', methods=['POST'])
def enable_2fa():
    """POST /api/user/2fa/enable — stub: mark 2FA enabled in session."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    session['2fa_enabled'] = True
    return jsonify({'status': 200, 'message': 'Two-factor authentication enabled'}), 200


@app.route('/api/user/2fa/disable', methods=['POST'])
def disable_2fa():
    """POST /api/user/2fa/disable — stub: mark 2FA disabled in session."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    session['2fa_enabled'] = False
    return jsonify({'status': 200, 'message': 'Two-factor authentication disabled'}), 200


# ═══════════════════════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════════════════════

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': datetime.now(timezone.utc).replace(tzinfo=None).isoformat()}), 200


# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════
if __name__ == '__main__':
    print("=" * 55)
    print("  ETool Unified Backend  –  http://localhost:5000")
    print("=" * 55)
    print("  AUTH")
    print("    POST  /api/login")
    print("    POST  /api/signup")
    print("    POST  /api/logout")
    print("    GET   /api/check-auth")
    print("    POST  /api/auth/google/callback")
    print("  USER")
    print("    GET   /api/verify-category-setup")
    print("    POST  /api/user/category-setup")
    print("    GET   /api/user/profile")
    print("  PLANS")
    print("    GET   /api/plans")
    print("    POST  /api/create-subscription")
    print("  PAYPAL")
    print("    GET   /api/paypal/config")
    print("    POST  /api/paypal/create-order")
    print("    POST  /api/paypal/execute-payment")
    print("    POST  /api/paypal/verify-payment")
    print("  DASHBOARD")
    print("    GET   /api/dashboard/stats")
    print("    GET   /api/dashboard/activity")
    print("    GET   /api/dashboard/plan")
    print("    GET   /api/dashboard/permissions")
    print("  TEAM")
    print("    GET   /api/team/members")
    print("    POST  /api/team/members")
    print("  BILLING")
    print("    GET   /api/billing/history")
    print("  FILES / DOCUMENTS")
    print("    POST   /api/files/upload")
    print("    POST   /api/files/convert")
    print("    GET    /api/files/download/<user_id>/<converted_id>")
    print("    GET    /api/files/documents")
    print("    DELETE /api/files/documents/<doc_id>")
    print("    GET    /api/files/formats")
    print("    GET    /api/files/db-list")
    print("  USER ACCOUNT")
    print("    POST   /api/user/change-password")
    print("    POST   /api/user/2fa/enable")
    print("    POST   /api/user/2fa/disable")
    print("    GET    /api/files/stored")
    print("    POST   /api/files/stored")
    print("    GET    /api/files/stored/<file_id>")
    print("    DELETE /api/files/stored/<file_id>")
    print("  HEALTH")
    print("    GET   /api/health")
    print("=" * 55)
    app.run(debug=True, port=5000, host='127.0.0.1')


# ═══════════════════════════════════════════════════════════
# ADDITIONAL ENDPOINTS (required by Use_Signup, Use_Payment,
# Use_Categorization, PayPalPayments, advanced-paypal-payment)
# ═══════════════════════════════════════════════════════════

# ── Subscription / plan session ──────────────────────────────

@app.route('/api/get/subscription/details', methods=['GET'])
def get_subscription_details():
    """Return subscription plan list (used by Use_Signup on load)."""
    db = DBSession()
    try:
        plans = db.query(SubscriptionPlan).filter_by(is_active=True).all()
        return jsonify({'status': 200, 'plans': [p.to_dict() for p in plans]}), 200
    finally:
        db.close()


@app.route('/api/get/created-subscription/session', methods=['GET'])
def get_created_subscription_session():
    """Return the subscription plan stored in the current session (Use_Payment)."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    db = DBSession()
    try:
        user = db.query(UserMember).filter_by(id=session['user_id']).first()
        plan = user.subscription_plan if user else None
        return jsonify({
            'status': 200,
            'subscription': plan.to_dict() if plan else None,
            'plan_name': plan.name if plan else 'Basic',
        }), 200
    finally:
        db.close()


@app.route('/api/get-completed-payment', methods=['GET'])
def get_completed_payment():
    """Return last completed payment details for the session user."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    # Extend with real payment records when available
    return jsonify({'status': 200, 'payment': None, 'message': 'No completed payment found'}), 200


@app.route('/api/create-subscription/basic', methods=['POST'])
def create_subscription_basic():
    """Assign the Basic (free) plan to the current user."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    db = DBSession()
    try:
        plan = ensure_basic_plan(db)
        user = db.query(UserMember).filter_by(id=session['user_id']).first()
        if user:
            user.subscription_plan_id = plan.id
            db.commit()
            session['subscription_plan_name'] = plan.name
        return jsonify({'status': 200, 'message': 'Basic plan assigned', 'plan': plan.to_dict()}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'status': 500, 'error': str(e)}), 500
    finally:
        db.close()


# ── Payment methods (card / bank / address) ──────────────────

@app.route('/api/card-details', methods=['PUT'])
def update_card_details():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    # Extend: persist card token via payment processor (never store raw card data)
    return jsonify({'status': 200, 'message': 'Card details updated (stub)'}), 200


@app.route('/api/add/card-payment', methods=['POST'])
def add_card_payment():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'Card payment recorded (stub)', 'data': data}), 200


@app.route('/api/add/pay-pal-address', methods=['POST'])
def add_paypal_address():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'PayPal address saved (stub)', 'data': data}), 200


@app.route('/api/add/bank-address', methods=['POST'])
def add_bank_address():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'Bank address saved (stub)', 'data': data}), 200


@app.route('/api/bank', methods=['POST'])
def add_bank():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'Bank details saved (stub)', 'data': data}), 200


@app.route('/api/add/address', methods=['POST'])
def add_address():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'Address saved (stub)', 'data': data}), 200


@app.route('/api/paypal', methods=['POST'])
def paypal_simple():
    """Simple PayPal entry used by Use_Payment."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'PayPal initiated', 'data': data}), 200


# ── Payments (PayPalPayments / paymentService) ────────────────

@app.route('/api/payments/verify', methods=['POST'])
def payments_verify():
    data       = request.get_json() or {}
    payment_id = data.get('paymentID') or data.get('payment_id') or data.get('orderID')
    return jsonify({'status': 200, 'verified': True, 'payment_id': payment_id}), 200


@app.route('/api/payments/status/<order_id>', methods=['GET'])
def payment_status(order_id):
    return jsonify({'status': 200, 'order_id': order_id, 'state': 'completed'}), 200


@app.route('/api/payments/list', methods=['GET'])
def payments_list():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    return jsonify({'status': 200, 'payments': []}), 200


@app.route('/api/payments/create-intent', methods=['POST'])
def create_payment_intent():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    return jsonify({
        'status': 200,
        'client_secret': f"mock_secret_{secrets.token_hex(8)}",
        'amount': data.get('amount'),
    }), 200


@app.route('/api/payments/create-payment-intent', methods=['POST'])
def create_payment_intent_v2():
    return create_payment_intent()


@app.route('/api/payments/update-payment-status', methods=['POST'])
def update_payment_status():
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'Payment status updated', 'data': data}), 200


@app.route('/api/payments/refund', methods=['POST'])
def payment_refund():
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'Refund initiated (stub)', 'data': data}), 200


@app.route('/api/cancel-order', methods=['POST'])
def cancel_order():
    data = request.get_json() or {}
    return jsonify({'status': 200, 'message': 'Order cancelled', 'data': data}), 200


@app.route('/api/create-paypal-order', methods=['POST'])
def create_paypal_order_v2():
    """Alias for /api/paypal/create-order (used by PayPalPayments.js)."""
    return paypal_create_order()


@app.route('/api/get/paypal_payment_details', methods=['GET'])
def get_paypal_payment_details():
    """Used by advanced-paypal-payment.js."""
    return jsonify({'status': 200, 'details': {}}), 200


@app.route('/api/paypal/payment-status/paymentId=<payment_id>', methods=['GET'])
def paypal_payment_status(payment_id):
    return jsonify({'status': 200, 'payment_id': payment_id, 'state': 'completed'}), 200


# ── Auth extras (Use_Signup uses /api/auth/google too) ────────

@app.route('/api/auth/google', methods=['POST'])
def auth_google_alias():
    """Alias – forwards to the main Google callback handler."""
    return google_callback()


# ── Category / member verification ────────────────────────────

@app.route('/api/get-verified-member', methods=['GET'])
def get_verified_member():
    """Return current user's verification status (Use_Categorization)."""
    if 'user_id' not in session:
        return jsonify({'status': 401, 'error': 'Not authenticated'}), 401
    db = DBSession()
    try:
        user = db.query(UserMember).filter_by(id=session['user_id']).first()
        if not user:
            return jsonify({'status': 404, 'error': 'User not found'}), 404
        return jsonify({
            'status': 200,
            'user': user.to_dict(),
            'is_verified': bool(user.is_verified),
        }), 200
    finally:
        db.close()


@app.route('/api/category', methods=['POST'])
def save_category():
    """Save professional category info (Use_Categorization)."""
    return save_category_setup()