-- Performance Optimization Indexes for Flex.IA PostgreSQL Database
-- These indexes improve query performance for common operations

-- User table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_active ON users(email) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_active ON users(role) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login ON users(last_login_at DESC) WHERE last_login_at IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Claims table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_status_priority ON claims(status, priority);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_adjuster_status ON claims(adjuster_id, status) WHERE adjuster_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_firm_status ON claims(firm_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_deadline_status ON claims(deadline ASC) WHERE status IN ('AVAILABLE', 'ASSIGNED', 'IN_PROGRESS');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_location ON claims(state, city);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_incident_date ON claims(incident_date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_estimated_value ON claims(estimated_value DESC) WHERE estimated_value IS NOT NULL;

-- Full-text search index for claims
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_search ON claims USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Earnings table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_earnings_user_status ON earnings(user_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_earnings_user_earned_date ON earnings(user_id, earned_date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_earnings_status_amount ON earnings(status, amount DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_earnings_claim_user ON earnings(claim_id, user_id) WHERE claim_id IS NOT NULL;

-- Messages table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_recipient_unread ON messages(recipient_id, created_at DESC) WHERE is_read = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_created ON messages(sender_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_claim_created ON messages(claim_id, created_at DESC) WHERE claim_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation ON messages(sender_id, recipient_id, created_at DESC);

-- Notifications table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type_created ON notifications(type, created_at DESC);

-- Documents table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_user_type ON documents(user_id, type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_claim_type ON documents(claim_id, type) WHERE claim_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- Sessions table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_user_expires ON sessions(user_id, expires_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at) WHERE expires_at > NOW();

-- Calendar events indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_user_start_time ON calendar_events(user_id, start_time);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_claim_start_time ON calendar_events(claim_id, start_time) WHERE claim_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_start_end_time ON calendar_events(start_time, end_time);

-- Firms table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_firms_active_name ON firms(name) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_firms_state_city ON firms(state, city) WHERE is_active = true;

-- Support tickets indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_support_user_status ON support_tickets(user_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_support_status_priority ON support_tickets(status, priority);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_support_created_at ON support_tickets(created_at DESC);

-- Affiliate partner indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliate_code ON affiliate_partners(affiliate_code) WHERE status = 'ACTIVE';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliate_status ON affiliate_partners(status);

-- Affiliate referrals indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referrals_affiliate_status ON affiliate_referrals(affiliate_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referrals_code ON affiliate_referrals(referral_code);

-- Chat sessions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_user_active ON chat_sessions(user_id, updated_at DESC) WHERE is_active = true;

-- Chat messages indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_session_time ON chat_messages(session_id, timestamp);

-- Waitlist indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_waitlist_status_created ON waitlist_entries(status, created_at DESC);

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_adjuster_firm_status ON claims(adjuster_id, firm_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_earnings_user_claim_status ON earnings(user_id, claim_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_claim_participants ON messages(claim_id, sender_id, recipient_id);

-- Partial indexes for better performance on filtered queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_available ON claims(created_at DESC) WHERE status = 'AVAILABLE';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_claims_overdue ON claims(deadline ASC) WHERE status IN ('ASSIGNED', 'IN_PROGRESS') AND deadline < NOW();
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_earnings_pending ON earnings(earned_date DESC) WHERE status = 'PENDING';

-- GIN indexes for JSON columns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_certifications ON users USING gin(certifications) WHERE certifications IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_specialties ON users USING gin(specialties) WHERE specialties IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_firms_specialties ON firms USING gin(specialties) WHERE specialties IS NOT NULL;

-- Analyze tables to update statistics
ANALYZE users;
ANALYZE claims;
ANALYZE earnings;
ANALYZE messages;
ANALYZE notifications;
ANALYZE documents;
ANALYZE sessions;
ANALYZE calendar_events;
ANALYZE firms;
ANALYZE support_tickets;
ANALYZE affiliate_partners;
ANALYZE affiliate_referrals;
ANALYZE chat_sessions;
ANALYZE chat_messages;
ANALYZE waitlist_entries;
