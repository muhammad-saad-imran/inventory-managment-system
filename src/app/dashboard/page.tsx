import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log({ user });
  return <p>Dashboard</p>;
}
