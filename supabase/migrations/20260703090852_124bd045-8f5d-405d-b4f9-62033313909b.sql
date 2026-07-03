
-- 1. Lock down SECURITY DEFINER functions: revoke broad EXECUTE.
-- has_role is invoked inside RLS policies; RLS evaluation runs as the table owner
-- and does not require the invoking role to hold EXECUTE, so revoking from
-- PUBLIC/anon/authenticated is safe.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
-- handle_new_user is fired by an auth trigger owned by the postgres role; no app role needs EXECUTE.

-- 2. Explicit deny policies on user_roles so intent is unmistakable.
-- Without INSERT/UPDATE/DELETE policies, RLS already blocks writes, but explicit
-- restrictive policies document that only service_role (which bypasses RLS) may
-- manage roles, preventing privilege escalation from client-writable paths.
CREATE POLICY "Block role inserts from clients"
  ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Block role updates from clients"
  ON public.user_roles
  AS RESTRICTIVE
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Block role deletes from clients"
  ON public.user_roles
  AS RESTRICTIVE
  FOR DELETE
  TO anon, authenticated
  USING (false);
