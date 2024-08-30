import { signout } from "@/utils/actions/auth.actions";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log({ user });
  return (
    <form>
      Dashboard
      <button className="border" formAction={signout}>
        signout
      </button>
    </form>
  );
}
