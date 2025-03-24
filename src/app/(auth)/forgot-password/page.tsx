import ForgotPasswordForm from "@/layouts/components/Form/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="mb-4 text-center">Forgot Password</h1>
        <p className="mb-8">
          Enter your email address to receive a password reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
