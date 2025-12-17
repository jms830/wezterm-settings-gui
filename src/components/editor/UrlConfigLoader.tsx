"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useConfigStore } from "@/lib/store/config-store";

export function UrlConfigLoader() {
  const searchParams = useSearchParams();
  const importConfig = useConfigStore((state) => state.importConfig);
  const processedRef = useRef(false);

  useEffect(() => {
    const configParam = searchParams.get("config");
    
    if (configParam && !processedRef.current) {
      processedRef.current = true;
      try {
        const binString = window.atob(configParam);
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
        const decoded = new TextDecoder().decode(bytes);
        
        const parsed = JSON.parse(decoded);
        
        if (typeof parsed === "object" && parsed !== null) {
          importConfig(parsed as Record<string, unknown>);
          
          const url = new URL(window.location.href);
          url.searchParams.delete("config");
          window.history.replaceState({}, "", url);
        }
      } catch (e) {
        console.error("Failed to import config from URL:", e);
      }
    }
  }, [searchParams, importConfig]);

  return null;
}
