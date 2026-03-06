"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";

const createEmotionCache = () => {
  return createCache({ key: "css", prepend: true });
};

export function AppRouterCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = React.useState(createEmotionCache);

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(" "),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
