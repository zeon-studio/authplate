"use client";
import { verifyEmail } from "@/app/action";
import useResponse from "@/hooks/useResponse";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ForgotPasswordForm = () => {
  const emailVerification = verifyEmail.bind(
    null,
    new Date().toISOString(),
    true,
  );
  const { dispatch, error } = useResponse(emailVerification);

  return (
    <form className="mx-auto max-w-md" action={dispatch}>
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="mb-2">
        <small className="text-red-600">{error}</small>
      </div>

      <Button
        type="submit"
        className=" focus:shadow-outline block w-full rounded bg-primary py-2 px-4 font-bold text-white hover:bg-primary/70 focus:outline-none"
      >
        Submit
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
