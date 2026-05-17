import { TErrorType, TResult } from "@/app/actions";
import { useActionState, useEffect } from "react";

type TMutationCallbacks<T> = {
  onSuccess?: (result: T) => void;
  onError?: (error: {
    success: false;
    error: {
      type: TErrorType;
      message: string;
      details?: Record<string, any>;
    };
  }) => void;
};

export function useMutation<T>(
  actionFunction: (state: TResult<T>, formData: FormData) => Promise<TResult<T>>,
  props?: TMutationCallbacks<T>,
): {
  action: (formData: FormData) => void;
  isPending: boolean;
  state: TResult<T>;
} {
  const [state, action, isPending] = useActionState(actionFunction, null);

  useEffect(() => {
    if (state?.success === true && props?.onSuccess) {
      props.onSuccess(state.data!);
    }
    if (state?.success === false && props?.onError) {
      // @ts-ignore
      props.onError(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    action: action,
    isPending: isPending,
    state: state,
  };
}
