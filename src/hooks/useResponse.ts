import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const useResponse = (
  updateForm: (
    prevState: any,
    formData: FormData,
  ) => Promise<{
    status: number;
    message: string;
  } | void>,
) => {
  const [state, dispatch] = useFormState(updateForm, null);
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    if (state?.status === 200) {
      setShowSubmitted(true);
      setSuccessMessage(state?.message);
      const clearSubmitted = () => setShowSubmitted(false);
      setTimeout(clearSubmitted, 3000);
      return clearSubmitted;
    } else if (state?.status === 400) {
      setError(state?.message);
    }
  }, [state]);

  return {
    showSubmitted,
    dispatch,
    successMessage,
    error,
  };
};

export default useResponse;
