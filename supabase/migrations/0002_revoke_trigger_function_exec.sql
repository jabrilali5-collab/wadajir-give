-- Trigger functions are SECURITY DEFINER; they must not be callable directly via /rest/v1/rpc.
-- is_admin() and campaign_recent_donations() stay executable on purpose (used by RLS policies / public donor wall).
revoke execute on function public.guard_campaign_columns() from public, anon, authenticated;
revoke execute on function public.guard_profile_columns() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.refresh_campaign_totals() from public, anon, authenticated;
revoke execute on function public.sync_organizer_verified() from public, anon, authenticated;
