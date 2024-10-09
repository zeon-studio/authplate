import React from "react";
import Sidebar from "./Sidebar";
interface User {
  first_name: string;
  last_name: string;
  email: string;
}

const SidebarContainer = async ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  return (
    <section className="section">
      <div className="container">
        <div className="row justify-center">
          <div className="md:col-10 col-12">
            <div className="bg-light p-20">
              <div className="row">
                <div className="md:col-4 md:block hidden ">
                  <Sidebar>
                    <div className="flex items-center justify-center flex-col pb-4 border-b-2 mb-4 border-border">
                      {/* <AvatarComponent shape="circle" size="2xl" /> */}
                      <h6>
                        {user.first_name} {user.last_name}
                      </h6>
                      <p className="text-sm text-text-light">{user.email}</p>
                    </div>
                  </Sidebar>
                </div>
                <div className=" md:col-8 col-12">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SidebarContainer;
