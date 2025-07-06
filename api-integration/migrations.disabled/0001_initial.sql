-- Migration number: 0001 	 2025-01-16T13:42:41.031Z
DROP TABLE IF EXISTS counters CASCADE;
DROP TABLE IF EXISTS access_logs CASCADE;

CREATE TABLE IF NOT EXISTS counters (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS access_logs (
  id SERIAL PRIMARY KEY,
  ip TEXT,
  path TEXT,
  accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 初始数据
INSERT INTO counters (name, value) VALUES 
  ('page_views', 0),
  ('api_calls', 0);

-- 创建索引
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);
CREATE INDEX idx_counters_name ON counters(name);
