-- Central database initialization
-- Run once on first start

-- Create additional schemas for tenancy
-- stancl/tenancy creates per-tenant schemas automatically

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- For fast text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- For composite indexes

-- Super admin tables live in the public schema
-- Tenant tables are created in separate schemas (tenant_<id>)

GRANT ALL PRIVILEGES ON DATABASE clinic_central TO clinic_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO clinic_user;
