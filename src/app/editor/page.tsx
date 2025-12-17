"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/editor/Sidebar";
import { SettingsPanel } from "@/components/editor/SettingsPanel";
import { ExportPanel } from "@/components/editor/ExportPanel";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useConfigStore } from "@/lib/store/config-store";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const TerminalPreview = dynamic(
  () => import("@/components/preview/TerminalPreview").then((mod) => mod.TerminalPreview),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <span className="text-sm text-muted-foreground">Loading preview...</span>
      </div>
    ),
  }
);

function TerminalPreviewFallback() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <h3 className="text-sm font-medium text-foreground">Preview</h3>
      </div>
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Preview unavailable - please refresh the page
        </p>
      </div>
    </div>
  );
}

function UrlConfigLoader() {
  const searchParams = useSearchParams();
  const importConfig = useConfigStore((state) => state.importConfig);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    
    const configParam = searchParams.get("config");
    if (configParam) {
      try {
        const binString = atob(configParam);
        const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));
        const jsonConfig = new TextDecoder().decode(bytes);
        const parsed = JSON.parse(jsonConfig);
        
        if (typeof parsed === "object" && parsed !== null) {
          importConfig(parsed);
          loadedRef.current = true;
          
          const url = new URL(window.location.href);
          url.searchParams.delete("config");
          window.history.replaceState({}, "", url.toString());
        }
      } catch (e) {
        console.error("Failed to load config from URL:", e);
      }
    }
  }, [searchParams, importConfig]);

  return null;
}

export default function EditorPage() {
  return (
    <>
      <Suspense fallback={null}>
        <UrlConfigLoader />
      </Suspense>
      <div className="flex h-screen bg-background">
      {/* Left sidebar - category navigation */}
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
      
      {/* Main content area with resizable panels */}
      <div className="flex-1 flex flex-col min-w-0">
        <ResizablePanelGroup direction="vertical">
          {/* Settings panel */}
          <ResizablePanel defaultSize={65} minSize={30}>
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 min-h-0 overflow-hidden">
                <ErrorBoundary>
                  <SettingsPanel />
                </ErrorBoundary>
              </div>
              <div className="flex-shrink-0">
                <ErrorBoundary>
                  <ExportPanel />
                </ErrorBoundary>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Terminal preview */}
          <ResizablePanel defaultSize={35} minSize={15}>
            <ErrorBoundary fallback={<TerminalPreviewFallback />}>
              <TerminalPreview />
            </ErrorBoundary>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
    </>
  );
}
