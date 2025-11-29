import { useMemo } from "react";
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

  const showSubmitted = useMemo(() => {
    return state?.status === 200;
  }, [state]);

  const error = useMemo(() => {
    return state?.status === 400 ? state.message : "";
  }, [state]);

  const successMessage = useMemo(() => {
    return state?.status === 200 ? state.message : "";
  }, [state]);

  return {
    showSubmitted,
    dispatch,
    successMessage,
    error,
  };
};

export default useResponse;
