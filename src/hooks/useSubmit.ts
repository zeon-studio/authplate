import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export type SubmitFormState<T> = {
  data: Omit<T, "variables"> | null;
  error: {
    path: string;
    message: string;
  }[];
  message: string | null;
  isError: boolean;
  isSuccess: boolean;
  statusCode: number | null;
};

export type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

type SubmitFormCallbacks<T> = {
  onSuccess?: (state: SubmitFormState<T>, ref: React.RefObject<any>) => void;
  onError?: (state: SubmitFormState<T>, ref: React.RefObject<any>) => void;
};

export function useSubmitForm<T>(
  serverAction: (
    prevState: SubmitFormState<Omit<T, "variables">>,
    data: ExtractVariables<T>,
  ) => Promise<SubmitFormState<Omit<T, "variables">>>,
  { onSuccess, onError }: SubmitFormCallbacks<T> = {},
) {
  const ref = useRef<any>(null);
  // @ts-ignore
  const [state, formAction] = useFormState<SubmitFormState<T>>(serverAction, {
    data: null,
    error: null,
    status: null,
    message: null,
    isError: false,
    isSuccess: false,
    statusCode: null,
  });

  useEffect(() => {
    if (state?.isError) {
      typeof onError === "function"
        ? onError(state, ref)
        : toast.error(state?.message);
    }

    if (state?.isSuccess) {
      typeof onSuccess === "function"
        ? onSuccess(state, ref)
        : toast.success(state?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    state,
    ref,
    // @ts-ignore
    action: formAction as (
      data: ExtractVariables<T>,
    ) => Promise<SubmitFormState<T>>,
  };
}
