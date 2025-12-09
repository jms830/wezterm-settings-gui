"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Trash2, GripVertical, Keyboard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useConfigStore } from "@/lib/store/config-store";
import { SettingWrapper } from "./SettingWrapper";
import type { KeybindOption, Keybind } from "@/lib/schema/types";

// Type for keybind with unique ID
interface KeybindWithId extends Keybind {
  _id: string;
}

// Generate a unique ID for keybinds
function generateKeybindId(): string {
  return `kb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Add IDs to keybinds that don't have them
function ensureKeybindIds(keybinds: Keybind[]): KeybindWithId[] {
  return keybinds.map((kb) => ({
    ...kb,
    _id: (kb as KeybindWithId)._id || generateKeybindId(),
  }));
}

// Strip IDs before saving to config
function stripKeybindIds(keybinds: KeybindWithId[]): Keybind[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return keybinds.map(({ _id, ...rest }) => rest);
}

// Common WezTerm actions
const WEZTERM_ACTIONS = [
  { value: "SpawnTab", label: "Spawn Tab", hasArgs: true },
  { value: "CloseCurrentTab", label: "Close Current Tab", hasArgs: true },
  { value: "ActivateTabRelative", label: "Activate Tab Relative", hasArgs: true },
  { value: "ActivateTab", label: "Activate Tab", hasArgs: true },
  { value: "SplitHorizontal", label: "Split Horizontal", hasArgs: true },
  { value: "SplitVertical", label: "Split Vertical", hasArgs: true },
  { value: "ActivatePaneDirection", label: "Activate Pane Direction", hasArgs: true },
  { value: "AdjustPaneSize", label: "Adjust Pane Size", hasArgs: true },
  { value: "CloseCurrentPane", label: "Close Current Pane", hasArgs: true },
  { value: "CopyTo", label: "Copy To", hasArgs: true },
  { value: "PasteFrom", label: "Paste From", hasArgs: true },
  { value: "IncreaseFontSize", label: "Increase Font Size", hasArgs: false },
  { value: "DecreaseFontSize", label: "Decrease Font Size", hasArgs: false },
  { value: "ResetFontSize", label: "Reset Font Size", hasArgs: false },
  { value: "Search", label: "Search", hasArgs: true },
  { value: "ActivateCommandPalette", label: "Command Palette", hasArgs: false },
  { value: "ShowLauncher", label: "Show Launcher", hasArgs: false },
  { value: "ShowTabNavigator", label: "Show Tab Navigator", hasArgs: false },
  { value: "ToggleFullScreen", label: "Toggle Full Screen", hasArgs: false },
  { value: "ScrollByPage", label: "Scroll By Page", hasArgs: true },
  { value: "ScrollByLine", label: "Scroll By Line", hasArgs: true },
  { value: "ScrollToTop", label: "Scroll To Top", hasArgs: false },
  { value: "ScrollToBottom", label: "Scroll To Bottom", hasArgs: false },
  { value: "ClearScrollback", label: "Clear Scrollback", hasArgs: true },
  { value: "QuickSelect", label: "Quick Select", hasArgs: false },
  { value: "ActivateCopyMode", label: "Activate Copy Mode", hasArgs: false },
  { value: "Nop", label: "No Operation (Disable)", hasArgs: false },
  { value: "DisableDefaultAssignment", label: "Disable Default", hasArgs: false },
  { value: "Multiple", label: "Multiple Actions", hasArgs: true },
  { value: "SendString", label: "Send String", hasArgs: true },
  { value: "SendKey", label: "Send Key", hasArgs: true },
];

const MODIFIER_KEYS = ["CTRL", "SHIFT", "ALT", "SUPER", "META"];

interface KeybindInputProps {
  option: KeybindOption;
}

function formatKeybind(keybind: Keybind): string {
  const mods = keybind.mods?.join("+") || "";
  return mods ? `${mods}+${keybind.key}` : keybind.key;
}

function KeybindEditor({
  keybind,
  onSave,
  onCancel,
}: {
  keybind: Keybind | null;
  onSave: (keybind: Keybind) => void;
  onCancel: () => void;
}) {
  const [key, setKey] = useState(keybind?.key || "");
  const [mods, setMods] = useState<string[]>(keybind?.mods || []);
  const [action, setAction] = useState(keybind?.action || "");
  const [actionArgs, setActionArgs] = useState(
    keybind?.actionArgs ? JSON.stringify(keybind.actionArgs, null, 2) : ""
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Validate JSON whenever actionArgs changes
  const validateJson = useCallback((value: string) => {
    if (!value.trim()) {
      setJsonError(null);
      return true;
    }
    try {
      JSON.parse(value);
      setJsonError(null);
      return true;
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      return false;
    }
  }, []);

  const handleActionArgsChange = useCallback((value: string) => {
    setActionArgs(value);
    validateJson(value);
  }, [validateJson]);

  const handleKeyCapture = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const capturedMods: string[] = [];
    if (e.ctrlKey) capturedMods.push("CTRL");
    if (e.shiftKey) capturedMods.push("SHIFT");
    if (e.altKey) capturedMods.push("ALT");
    if (e.metaKey) capturedMods.push("SUPER");

    // Map key codes to WezTerm key names
    let keyName = e.key;
    if (keyName === " ") keyName = "Space";
    else if (keyName === "ArrowUp") keyName = "UpArrow";
    else if (keyName === "ArrowDown") keyName = "DownArrow";
    else if (keyName === "ArrowLeft") keyName = "LeftArrow";
    else if (keyName === "ArrowRight") keyName = "RightArrow";
    else if (keyName === "Escape") keyName = "Escape";
    else if (keyName === "Enter") keyName = "Enter";
    else if (keyName === "Tab") keyName = "Tab";
    else if (keyName === "Backspace") keyName = "Backspace";
    else if (keyName === "Delete") keyName = "Delete";
    else if (keyName.startsWith("F") && keyName.length <= 3) {
      // F1-F12 keys
    } else if (keyName.length === 1) {
      keyName = keyName.toLowerCase();
    } else if (["Control", "Shift", "Alt", "Meta"].includes(keyName)) {
      // Don't set modifier-only keys
      return;
    }

    setMods(capturedMods);
    setKey(keyName);
    setIsCapturing(false);
  }, []);

  const toggleMod = (mod: string) => {
    setMods((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleSave = () => {
    if (!key || !action) return;

    let parsedArgs: Record<string, unknown> | undefined;
    if (actionArgs.trim()) {
      try {
        parsedArgs = JSON.parse(actionArgs);
      } catch {
        // Invalid JSON - don't save if there's an error
        if (jsonError) return;
      }
    }

    onSave({
      key,
      mods: mods.length > 0 ? mods : undefined,
      action,
      actionArgs: parsedArgs,
    });
  };

  const selectedAction = WEZTERM_ACTIONS.find((a) => a.value === action);
  const canSave = key && action && !jsonError;

  return (
    <div className="space-y-4">
      {/* Key Capture */}
      <div className="space-y-2">
        <Label id="key-capture-label">Key Combination</Label>
        <div className="flex gap-2">
          <div
            className={`flex-1 flex items-center justify-center h-12 border rounded-md cursor-pointer transition-colors ${
              isCapturing
                ? "border-primary bg-primary/10 ring-2 ring-primary"
                : "border-input bg-background hover:bg-muted"
            }`}
            role="button"
            tabIndex={0}
            aria-labelledby="key-capture-label"
            aria-pressed={isCapturing}
            aria-describedby="key-capture-hint"
            onClick={() => setIsCapturing(true)}
            onKeyDown={isCapturing ? handleKeyCapture : undefined}
            onBlur={() => setIsCapturing(false)}
          >
            {isCapturing ? (
              <span className="text-primary animate-pulse">Press a key combination...</span>
            ) : key ? (
              <span className="font-mono text-lg">{formatKeybind({ key, mods, action: "" })}</span>
            ) : (
              <span className="text-muted-foreground">Click to capture key</span>
            )}
          </div>
        </div>
        <span id="key-capture-hint" className="sr-only">
          Click to start capturing a key combination, then press the desired keys
        </span>
      </div>

      {/* Manual Key Input */}
      <div className="space-y-2">
        <Label>Or enter manually</Label>
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="e.g., t, F1, UpArrow"
        />
      </div>

      {/* Modifiers */}
      <div className="space-y-2">
        <Label>Modifiers</Label>
        <div className="flex flex-wrap gap-2">
          {MODIFIER_KEYS.map((mod) => (
            <label
              key={mod}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={mods.includes(mod)}
                onCheckedChange={() => toggleMod(mod)}
              />
              <span className="text-sm">{mod}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="space-y-2">
        <Label>Action</Label>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger>
            <SelectValue placeholder="Select action..." />
          </SelectTrigger>
          <SelectContent>
            {WEZTERM_ACTIONS.map((a) => (
              <SelectItem key={a.value} value={a.value}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Arguments */}
      {selectedAction?.hasArgs && (
        <div className="space-y-2">
          <Label>Action Arguments (JSON)</Label>
          <Input
            value={actionArgs}
            onChange={(e) => handleActionArgsChange(e.target.value)}
            placeholder='e.g., {"domain": "CurrentPaneDomain"}'
            className={`font-mono ${jsonError ? "border-destructive" : ""}`}
            aria-invalid={!!jsonError}
            aria-describedby={jsonError ? "json-error" : undefined}
          />
          {jsonError ? (
            <div id="json-error" className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>{jsonError}</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Optional JSON object for action parameters
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!canSave}>
          {keybind ? "Update" : "Add"} Keybind
        </Button>
      </DialogFooter>
    </div>
  );
}

export function KeybindInput({ option }: KeybindInputProps) {
  const value = useConfigStore((state) => state.getValue(option.id)) as Keybind[];
  const setValue = useConfigStore((state) => state.setValue);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Memoize keybinds with stable IDs
  const keybindsWithIds = useMemo(() => ensureKeybindIds(value), [value]);

  const handleSave = useCallback((keybind: Keybind) => {
    if (editingId !== null) {
      // Update existing - find by ID
      const index = keybindsWithIds.findIndex((kb) => kb._id === editingId);
      if (index !== -1) {
        const newValue = [...keybindsWithIds];
        newValue[index] = { ...keybind, _id: editingId };
        setValue(option.id, stripKeybindIds(newValue));
      }
      setEditingId(null);
    } else {
      // Add new with generated ID
      const newKeybind: KeybindWithId = { ...keybind, _id: generateKeybindId() };
      setValue(option.id, stripKeybindIds([...keybindsWithIds, newKeybind]));
      setIsAddingNew(false);
    }
  }, [editingId, keybindsWithIds, option.id, setValue]);

  const handleDelete = useCallback((id: string) => {
    const newValue = keybindsWithIds.filter((kb) => kb._id !== id);
    setValue(option.id, stripKeybindIds(newValue));
  }, [keybindsWithIds, option.id, setValue]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsAddingNew(false);
  }, []);

  // Find the keybind being edited
  const editingKeybind = editingId
    ? keybindsWithIds.find((kb) => kb._id === editingId) ?? null
    : null;

  return (
    <SettingWrapper option={option}>
      <div className="space-y-3">
        {/* Keybind List */}
        <div className="border rounded-md divide-y divide-border">
          {keybindsWithIds.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No custom keybindings defined
            </div>
          ) : (
            keybindsWithIds.map((keybind) => (
              <div
                key={keybind._id}
                className="flex items-center gap-3 p-3 group hover:bg-muted/50"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {formatKeybind(keybind)}
                    </Badge>
                    <span className="text-sm text-muted-foreground" aria-hidden="true">→</span>
                    <span className="text-sm font-medium">{keybind.action}</span>
                  </div>
                  {keybind.actionArgs && (
                    <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                      {JSON.stringify(keybind.actionArgs)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(keybind._id)}
                    aria-label={`Edit keybinding ${formatKeybind(keybind)}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(keybind._id)}
                    aria-label={`Delete keybinding ${formatKeybind(keybind)}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingNew(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Keybinding
        </Button>

        {/* Edit/Add Dialog */}
        <Dialog
          open={editingId !== null || isAddingNew}
          onOpenChange={(open) => {
            if (!open) handleCancel();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                {editingId !== null ? "Edit Keybinding" : "Add Keybinding"}
              </DialogTitle>
              <DialogDescription>
                Configure a keyboard shortcut and its action.
              </DialogDescription>
            </DialogHeader>
            <KeybindEditor
              keybind={editingKeybind}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </SettingWrapper>
  );
}
