import { SubmitFormState } from "@/hooks/useSubmit";
import { Prisma } from "@prisma/client";

export async function mutate<T>(
  callback: () => Promise<any>,
): Promise<SubmitFormState<T>> {
  try {
    const { message, data, statusCode, isError, error, isSuccess } =
      (await callback()) || {};
    return {
      data: data as T,
      error,
      message,
      isError,
      isSuccess,
      statusCode,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        data: null,
        isError: true,
        isSuccess: false,
        error: [],
        message: err.message,
        statusCode: 500,
      };
    }

    return {
      data: null,
      isError: true,
      isSuccess: false,
      error: [],
      message: "Something went wrong",
      statusCode: 500,
    };
  }
}

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export function prismaExclude<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
}
