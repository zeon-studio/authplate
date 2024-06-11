import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
const SubmitButton = ({
  label,
  className,
  pending_label,
}: {
  label: string;
  className: string;
  pending_label: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className={`font-bold text-lg ${className}`}
      aria-disabled={pending}
    >
      {pending ? pending_label : label}
    </Button>
  );
};
export default SubmitButton;
