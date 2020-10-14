create table if not exists public_user (id text primary key not null, ts timestamp with time zone DEFAULT CURRENT_TIMESTAMP, resource jsonb);

create table if not exists settings (id text primary key not null, ts timestamp with time zone DEFAULT CURRENT_TIMESTAMP, resource jsonb);

create table if not exists condition (id text primary key not null, ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, resource jsonb);

SELECT 'CREATE DATABASE fortest TEMPLATE mobile-db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fortest')\gexec
