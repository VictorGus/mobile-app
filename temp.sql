---- db:  -h localhost -p 5443 -U postgres mobile-db
----
create table if not exists public_user (id text primary key not null,
                                        ts timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                                        settings_id text,
                                        CONSTRAINT fk_settings
                                        FOREIGN KEY(settings_id)
                                        REFERENCES settings(id)
                                        ON DELETE SET NULL,
                                        resource jsonb);
----
create table if not exists settings (id text primary key not null,
                                     ts timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                                     resource jsonb);
----
create table if not exists condition (id text primary key not null,
                                      ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                      user_id text,
                                      CONSTRAINT fk_user
                                      FOREIGN KEY(user_id)
                                      REFERENCES public_user(id)
                                      ON DELETE SET NULL,
                                      resource jsonb);
----
create table if not exists notification (id text primary key not null,
ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
user_id text,
CONSTRAINT fk_user
FOREIGN KEY(user_id)
REFERENCES public_user(id)
ON DELETE SET NULL,
resource jsonb);
----
insert into public_user (id, settings_id) values ('user-1', 'set-1')
----
insert into settings (id) values ('set-1')
----
select * from public_user p left join settings s on p.settings_id = s.id
----
update public_user set resource = '{"name":{"family":"Test","given":"Test"},"email":"test@gmail.com","username":"test","age":"45","active":true,"password":"encrypted"}'::jsonb;
----
drop table condition
----
