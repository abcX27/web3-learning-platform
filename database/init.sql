-- Database initialization script
-- This script runs when the PostgreSQL container is first created

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create initial database (if not exists)
-- The database is already created by POSTGRES_DB env variable
-- This file can be used for additional initialization

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'Database initialized successfully';
END $$;
