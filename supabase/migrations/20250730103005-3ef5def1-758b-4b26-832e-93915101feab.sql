-- Create a test user profile and role for testing
-- Test user credentials: test@auctionhero.com / password123

-- Insert test user profile (the user will be created through Supabase Auth UI)
-- This is just a placeholder profile that will be linked when the user signs up
INSERT INTO public.profiles (user_id, username, display_name, created_at, updated_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'testuser',
  'Test User',
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;

-- Assign admin role to test user for testing purposes
INSERT INTO public.user_roles (user_id, role, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin'::app_role,
  now()
) ON CONFLICT (user_id, role) DO NOTHING;