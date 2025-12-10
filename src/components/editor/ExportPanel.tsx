"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Download, Copy, Check, RotateCcw, Code2, Upload, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useConfigStore } from "@/lib/store/config-store";
import { generateLuaConfig, downloadLuaConfig, copyLuaConfig } from "@/lib/export/lua-generator";
import { parseLuaConfig } from "@/lib/export/lua-parser";

export function ExportPanel() {
  const config = useConfigStore((state) => state.config);
  const resetAll = useConfigStore((state) => state.resetAll);
  const importConfig = useConfigStore((state) => state.importConfig);
  const modifiedCount = Object.keys(config).length;
  
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    // Clear existing timeouts to prevent race conditions
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = null;
    }
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    
    try {
      await copyLuaConfig(config);
      setCopied(true);
      setCopyError(null);
      
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyError("Failed to copy - check clipboard permissions");
      setCopied(false);
      
      errorTimeoutRef.current = setTimeout(() => {
        setCopyError(null);
        errorTimeoutRef.current = null;
      }, 3000);
    }
  }, [config]);

  const handleDownload = useCallback(() => {
    try {
      downloadLuaConfig(config);
    } catch (error) {
      console.error("Failed to download:", error);
    }
  }, [config]);

  const handleImport = useCallback(() => {
    try {
      const parsed = parseLuaConfig(importText);
      importConfig(parsed);
      setImportOpen(false);
      setImportText("");
      setImportError(null);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Failed to parse configuration");
    }
  }, [importText, importConfig]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsFileLoading(true);
      setImportError(null);
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setImportText(content);
        setIsFileLoading(false);
      };
      
      reader.onerror = () => {
        setImportError("Failed to read file");
        setIsFileLoading(false);
      };
      
      reader.readAsText(file);
    }
    
    // Reset input so same file can be selected again
    e.target.value = "";
  }, []);

  const handleImportTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportText(e.target.value);
    setImportError(null);
  }, []);

  const handleResetAll = useCallback(() => {
    resetAll();
    setResetConfirmOpen(false);
  }, [resetAll]);

  const luaPreview = generateLuaConfig(config, { includeComments: true });

  return (
    <div className="flex items-center gap-2 p-4 border-t border-border bg-muted/30">
      <div className="flex-1 text-sm text-muted-foreground">
        {modifiedCount} option{modifiedCount !== 1 ? "s" : ""} modified
        {copyError && (
          <span className="ml-2 text-destructive">{copyError}</span>
        )}
      </div>

      {/* Reset All */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setResetConfirmOpen(true)}
        disabled={modifiedCount === 0}
        className="text-muted-foreground hover:text-destructive"
        aria-label="Reset all settings to defaults"
      >
        <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
        Reset All
      </Button>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all settings?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all {modifiedCount} modified options back to their default values.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Import configuration file">
            <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Configuration</DialogTitle>
            <DialogDescription>
              Paste your existing wezterm.lua content or upload a file to import settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".lua"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload Lua configuration file"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isFileLoading}
              >
                {isFileLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                    Upload File
                  </>
                )}
              </Button>
            </div>

            <Textarea
              value={importText}
              onChange={handleImportTextChange}
              placeholder="-- Paste your wezterm.lua content here..."
              className="font-mono text-sm h-64"
              aria-label="Lua configuration content"
            />

            {importError && (
              <div 
                className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" aria-hidden="true" />
                <div className="text-sm text-destructive">{importError}</div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!importText.trim() || isFileLoading}>
              Import Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Preview generated Lua configuration">
            <Code2 className="h-4 w-4 mr-2" aria-hidden="true" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Lua Configuration Preview</DialogTitle>
            <DialogDescription>
              This is the generated wezterm.lua file based on your settings.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] mt-4">
            <pre 
              className="p-4 bg-muted rounded-md text-sm font-mono overflow-x-auto"
              aria-label="Generated Lua configuration"
            >
              {luaPreview}
            </pre>
          </ScrollArea>
          <div className="flex items-center justify-between gap-4 mt-4">
            <p className="text-xs text-muted-foreground">
              Save this file to{" "}
              <code className="px-1.5 py-0.5 bg-muted rounded text-foreground">
                ~/.config/wezterm/wezterm.lua
              </code>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Copy */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy configuration to clipboard"}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" aria-hidden="true" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
            Copy
          </>
        )}
      </Button>

      {/* Quick Export */}
      <Button size="sm" onClick={handleDownload} aria-label="Download configuration as wezterm.lua">
        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
        Export
      </Button>
    </div>
  );
}
