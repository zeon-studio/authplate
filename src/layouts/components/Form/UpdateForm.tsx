"use client";
import { updateForm } from "@/app/action";
import useResponse from "@/hooks/useResponse";
import SubmitButton from "../SubmitButton";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const UpdateForm = ({ user }: { user: any }) => {
  const { showSubmitted, dispatch, error } = useResponse(updateForm);
  return (
    <div>
      <form action={dispatch} className="mx-auto row">
        <div className="col-12">
          <h2 className="mb-2">Update your profile</h2>
        </div>

        <div className="mb-4 col-12 md:col-6">
          <Label htmlFor="first_name">First Named</Label>
          <Input
            id="first_name"
            placeholder="First Name"
            type="text"
            name="first_name"
            defaultValue={user.first_name}
            required
          />
        </div>
        <div className="mb-4 col-12 md:col-6">
          <Label htmlFor="last_name">Last Named</Label>
          <Input
            id="last_name"
            placeholder="Last Name"
            type="text"
            name="last_name"
            defaultValue={user.last_name}
            required
          />
        </div>

        <div className="mb-2">
          <small className="text-red-600">{error}</small>
        </div>
        <div className="col-12 mt-4">
          <SubmitButton
            label="Save Update"
            className="inline"
            pending_label="Updating..."
          />
        </div>
      </form>
    </div>
  );
};
export default UpdateForm;
