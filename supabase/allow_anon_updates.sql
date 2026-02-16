-- RUN THIS IN YOUR SUPABASE DASHBOARD -> SQL EDITOR

-- 1. Enable RLS (if not already enabled)
alter table "public"."research_briefs" enable row level security;

-- 2. Create policy to allow anonymous updates
create policy "Allow Anonymous Updates for MVP"
on "public"."research_briefs"
for update
to anon
using (true)
with check (true);

-- 3. Verify policy created
select * from pg_policies where tablename = 'research_briefs';
