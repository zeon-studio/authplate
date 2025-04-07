import UpdatePasswordForm from "@/components/Form/UpdatePasswordForm";
import SetPasswordForProvider from "@/components/SetPasswordForProvider";
import { authOptions } from "@/lib/auth";
import { fetchUser } from "@/lib/fetchUser";
import SidebarContainer from "@/partials/SidebarContainer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Settings = async () => {
  const session = await getServerSession(authOptions);
  const user = await fetchUser(session?.user?.email!);
  if (!session) {
    redirect("/login");
  } else if (user?.isValid === false) {
    redirect("/");
  }
  return (
    <SidebarContainer user={user}>
      <div className="bg-white rounded-lg px-8 py-12">
        <div className="mb-12">
          {user.isValid ? <UpdatePasswordForm /> : <SetPasswordForProvider />}
        </div>
      </div>
    </SidebarContainer>
  );
};

export default Settings;
