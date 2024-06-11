"use client";
import InputField from "../InputField";
import LabelField from "../LabelField";
import SubmitButton from "../SubmitButton";

const EmailVerificationForm = () => {
  return (
    <>
      <form className="mx-auto max-w-md">
        <div className="mb-4">
          <LabelField label="Email" />
          <InputField
            type="email"
            id="email"
            placeholder="Enter your email"
            name="email"
            required
          />
        </div>

        <SubmitButton
          label="Submit"
          className="w-full"
          pending_label="Submitting"
        />
      </form>
    </>
  );
};

export default EmailVerificationForm;
