"use client";
import { resetPassword } from "@/app/action";
import useResponse from "@/hooks/useResponse";
import SubmitButton from "../SubmitButton";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ResetPasswordForm = ({ email }: { email: string }) => {
  const reset = resetPassword.bind(null, email);
  const { dispatch, error } = useResponse(reset);

  return (
    <form className="mx-auto row" action={dispatch}>
      <div className="col-12">
        <h2 className="mb-2">Reset Password</h2>
      </div>

      <div className="mb-4 col-12 md:col-6">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="Password"
          color="gray"
          type="password"
          name="password"
          required
        />
      </div>
      <div className="mb-4 col-12 md:col-6">
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <Input
          id="confirm_password"
          placeholder="Confirm Password"
          color="gray"
          type="password"
          name="confirm_password"
          required
        />
      </div>

      <div className="mb-2">
        <small className="text-red-600">{error}</small>
      </div>
      <div className="col-12">
        <SubmitButton
          className="w-full"
          label="Reset Password"
          pending_label="Reset Password..."
        />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
