create table if not exists public_user (id text primary key not null, device_id text);

create table if not exists condition (id text primary key not null, user_id text, date_time timestamp, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public_user(id) ON DELETE SET NULL, wellbeing text);

create table if not exists notification (id text primary key not null, user_id text, category text, n_action text, notification_rate bigint, date_time timestamp, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public_user(id) ON DELETE SET NULL);

create table if not exists notification_result (id text primary key not null, notification_id text, category text, date_time timestamp, n_action text, n_result text);

create table if not exists settings (id text primary key not null, user_id text, enable_achievements boolean, enable_notifications boolean, enable_condition_check boolean, enable_md_sync boolean, sync_date_time timestamp, condition_period_from timestamp, condition_period_to timestamp, sync_rate bigint, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public_user(id) ON DELETE SET NULL);

SELECT 'CREATE DATABASE fortest TEMPLATE mobiledb' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fortest')\gexec
