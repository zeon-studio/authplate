"use client";
import { Facebook, Github, LogIn } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";

interface AuthProvider {
  callbackUrl: string;
  id: string;
  name: string;
  signinUrl: string;
  type: string;
}

const providers = [
  {
    id: "google",
    icon: <LogIn className="text-h4" />,
  },
  {
    id: "github",
    icon: <Github className="text-h4" />,
  },
  {
    id: "facebook",
    icon: <Facebook className="text-h4" />,
  },
];


const Provider = ({ provider }: { provider: AuthProvider }) => {
  const session = useSession();
  
  return (
    providers.find((item) => item.id === provider.id) && (
      <div
        key={provider.id}
        className="mx-auto mt-4 flex justify-center text-center"
      >
        <Button
          onClick={() => signIn("google")}
          className="flex items-center justify-center font-semibold text-dark py-3 border-border border rounded-md w-full"
        >
          <span className="mr-2">
            {providers.find((item) => item.id === provider.id)?.icon}
          </span>{" "}
          Sign in with {provider.name}
        </Button>
      </div>
    )
  );
};

export default Provider;
