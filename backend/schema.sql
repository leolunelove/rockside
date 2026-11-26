-- Isolated server-only configuration and hashed rate-limit metadata.
create schema if not exists rockside_private;
revoke all on schema rockside_private from public, anon, authenticated;
grant usage on schema rockside_private to service_role;
create table rockside_private.mail_settings (
 id boolean primary key default true check (id),
 recipient text not null,
 sender text not null
);
create table rockside_private.contact_limits (
 id uuid primary key,
 fingerprint text not null,
 email_hash text not null,
 ip_hash text not null,
 created_at timestamptz not null default pg_catalog.now()
);
create index rockside_contact_limits_created on rockside_private.contact_limits(created_at);
alter table rockside_private.mail_settings enable row level security;
alter table rockside_private.contact_limits enable row level security;
revoke all on all tables in schema rockside_private from public, anon, authenticated;
grant select on rockside_private.mail_settings to service_role;
grant select,insert,delete on rockside_private.contact_limits to service_role;
create function public.rockside_mail_settings() returns jsonb
language sql stable security invoker set search_path = '' as $$
 select pg_catalog.jsonb_build_object('recipient',recipient,'sender',sender)
 from rockside_private.mail_settings where id = true
$$;
revoke all on function public.rockside_mail_settings() from public,anon,authenticated;
grant execute on function public.rockside_mail_settings() to service_role;
create function public.rockside_reserve_contact(p_id uuid,p_fingerprint text,p_email text,p_ip text) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare previous_fingerprint text;
begin
 perform pg_catalog.pg_advisory_xact_lock(7265726501::bigint);
 delete from rockside_private.contact_limits where created_at < pg_catalog.now()-interval '24 hours';
 select fingerprint into previous_fingerprint from rockside_private.contact_limits where id=p_id;
 if found then return previous_fingerprint=p_fingerprint; end if;
 if (select count(*) from rockside_private.contact_limits where created_at>pg_catalog.now()-interval '1 hour' and (email_hash=p_email or ip_hash=p_ip))>=3 then return false; end if;
 if (select count(*) from rockside_private.contact_limits)>=50 then return false; end if;
 insert into rockside_private.contact_limits(id,fingerprint,email_hash,ip_hash) values(p_id,p_fingerprint,p_email,p_ip);
 return true;
end
$$;
revoke all on function public.rockside_reserve_contact(uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.rockside_reserve_contact(uuid,text,text,text) to service_role;
-- Recipient is inserted privately at deployment; never seed it in public source.
