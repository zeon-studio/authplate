import Provider from "../Provider";
import LoginForm from "./LoginForm";

const SingInForm = async ({ authProviders }: { authProviders: any }) => {
  return (
    <>
      <LoginForm key="credentials" />
      <div className="relative w-full h-[1px] bg-[#B3B8C2] mb-4">
        <span className="absolute bg-light z-10 inline-block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2">
          Or Continue With
        </span>
      </div>
      {authProviders?.map(
        (provider: any) =>
          provider.type != "credentials" && (
            <Provider key={provider.id} provider={provider} />
          ),
      )}
    </>
  );
};

export default SingInForm;
