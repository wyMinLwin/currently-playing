-- Setup
create extension if not exists "uuid-ossp";

-- Tables
create table users (
  id uuid primary key default uuid_generate_v4(),
  public_id text unique not null,
  spotify_user_id text unique not null,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table credentials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  scope text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

create table sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  session_token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Indexes
create index idx_users_public_id on users(public_id);
create index idx_users_spotify_user_id on users(spotify_user_id);
create index idx_credentials_user_id on credentials(user_id);
create index idx_sessions_token on sessions(session_token);
create index idx_sessions_user_id on sessions(user_id);

-- RLS Policies
alter table users enable row level security;
alter table credentials enable row level security;
alter table sessions enable row level security;

-- Ping table (prevents Supabase free-tier auto-pause)
create table ping (
  id integer primary key default 1,
  pinged_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into ping (id, pinged_at) values (1, now());
