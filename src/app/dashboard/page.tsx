import { auth } from "@/auth";
import UpdateForm from "@/components/Form/UpdateForm";
import SidebarContainer from "@/partials/SidebarContainer";

const Dashboard = async () => {
  const { user } = (await auth()) || {};

  return (
    <SidebarContainer user={user!}>
      <div className="bg-white rounded-lg px-8 py-12">
        <div className="mb-12">
          <UpdateForm user={user} />
        </div>
      </div>
    </SidebarContainer>
  );
};

export default Dashboard;
