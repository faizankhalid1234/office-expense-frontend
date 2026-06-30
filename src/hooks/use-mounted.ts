"use client";

import { useEffect, useState } from "react";

/** True after the first client paint — use to avoid SSR/client hydration mismatches. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
