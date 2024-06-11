"use client";
import { updatePassword } from "@/app/action";
import useResponse from "@/hooks/useResponse";
import SubmitButton from "../SubmitButton";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
const UpdatePasswordForm = () => {
  // const [state, dispatch] = useFormState(updatePassword, null);
  const { dispatch } = useResponse(updatePassword);
  return (
    <form action={dispatch} className="mx-auto row">
      <div className="col-12">
        <h2 className="mb-2">Update your password</h2>
      </div>
      <div className="mb-4 col-12 md:col-6">
        <Label htmlFor="current_password">Current Password</Label>
        <Input
          id="current_password"
          placeholder="Current Password"
          color="gray"
          type="password"
          name="current_password"
          required
        />
      </div>
      <div className="mb-4 col-12 md:col-6">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          name="password"
          required
        />
      </div>

      <div className="col-12 mt-4">
        <SubmitButton
          label="Save Update"
          className="inline"
          pending_label="Save Updating..."
        />
      </div>
    </form>
  );
};
export default UpdatePasswordForm;
