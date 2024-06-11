"use client";

import { getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type ProvidersType = UnwrapPromise<ReturnType<typeof getProviders>>;

export default function ProviderList() {
  const [providers, setProviders] = useState<ProvidersType>();
  useEffect(() => {
    if (providers?.length) {
      getProviders().then((res) => {
        setProviders(res);
      });
    }
  }, []);

  return <h1>Providers</h1>;
}
