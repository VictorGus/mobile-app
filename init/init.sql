create table if not exists settings (id text primary key not null, ts timestamp with time zone DEFAULT CURRENT_TIMESTAMP, resource jsonb);

create table if not exists condition (id text primary key not null, ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, resource jsonb);

create table if not exists public_user (id text primary key not null, ts timestamp with time zone DEFAULT CURRENT_TIMESTAMP, settings_id text, condition_id text, CONSTRAINT fk_condition FOREIGN KEY(condition_id) REFERENCES settings(id) ON DELETE SET NULL, CONSTRAINT fk_settings FOREIGN KEY(settings_id) REFERENCES settings(id) ON DELETE SET NULL, resource jsonb);


create table if not exists notification (id text primary key not null, ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, user_id text, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public_user(id) ON DELETE SET NULL, resource jsonb);

SELECT 'CREATE DATABASE fortest TEMPLATE mobile-db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fortest')\gexec
