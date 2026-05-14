import { createClient } from '@/lib/supabase/server';
import { UsersTable, type AdminProfileRow } from './UsersTable';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, subscription_status, subscription_expires_at, created_at')
    .order('created_at', { ascending: false });

  return <UsersTable profiles={(profiles ?? []) as AdminProfileRow[]} />;
}
