#!/bin/bash

# default PORT is 5443

PGPASSWORD=postgres psql -h localhost -p ${PGPORT} -U postgres mobiledb -c "
create table if not exists public_user (id text primary key not null, device_id text);

create table if not exists condition (id text primary key not null, user_id text, date_time timestamp, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public_user(id) ON DELETE SET NULL, wellbeing text);

create table if not exists notification (id text primary key not null, user_id text, category text, n_action text, notification_rate bigint, date_time timestamp, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public_user(id) ON DELETE SET NULL);

create table if not exists notification_result (id text primary key not null, notification_id text, category text, date_time timestamp, n_result text, CONSTRAINT fk_notification FOREIGN KEY(notification_id) REFERENCES notification(id) ON DELETE SET NULL);

create table if not exists settings (id text primary key not null, user_id text, enable_achievements boolean, enable_notifications boolean, enable_md_sync boolean, sync_date_time timestamp, sync_rate bigint, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES public_user(id) ON DELETE SET NULL);
"

echo "Done"
