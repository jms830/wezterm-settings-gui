"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Trash2, GripVertical, Terminal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useConfigStore } from "@/lib/store/config-store";
import { SettingWrapper } from "./SettingWrapper";
import type { LaunchMenuOption, LaunchMenuItem } from "@/lib/schema/types";

// Type for launch menu item with unique ID
interface LaunchMenuItemWithId extends LaunchMenuItem {
  _id: string;
}

// Generate a unique ID
function generateItemId(): string {
  return `lm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Add IDs to items that don't have them
function ensureItemIds(items: LaunchMenuItem[]): LaunchMenuItemWithId[] {
  return items.map((item) => ({
    ...item,
    _id: (item as LaunchMenuItemWithId)._id || generateItemId(),
  }));
}

// Strip IDs before saving to config
function stripItemIds(items: LaunchMenuItemWithId[]): LaunchMenuItem[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return items.map(({ _id, ...rest }) => rest);
}

// Common shell presets
const SHELL_PRESETS = [
  { label: "PowerShell", args: ["pwsh.exe"] },
  { label: "PowerShell (Windows)", args: ["powershell.exe"] },
  { label: "Command Prompt", args: ["cmd.exe"] },
  { label: "WSL (Default)", args: ["wsl.exe"] },
  { label: "WSL Ubuntu", args: ["wsl.exe", "-d", "Ubuntu"] },
  { label: "WSL Debian", args: ["wsl.exe", "-d", "Debian"] },
  { label: "Git Bash", args: ["C:\\Program Files\\Git\\bin\\bash.exe", "-l"] },
  { label: "Bash", args: ["/bin/bash"] },
  { label: "Zsh", args: ["/bin/zsh"] },
  { label: "Fish", args: ["/usr/bin/fish"] },
];

interface LaunchMenuInputProps {
  option: LaunchMenuOption;
}

function LaunchMenuEditor({
  item,
  onSave,
  onCancel,
}: {
  item: LaunchMenuItem | null;
  onSave: (item: LaunchMenuItem) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(item?.label || "");
  const [args, setArgs] = useState(item?.args?.join(" ") || "");
  const [cwd, setCwd] = useState(item?.cwd || "");
  const [domain, setDomain] = useState(item?.domain || "");

  const handleSave = () => {
    if (!label.trim()) return;

    const newItem: LaunchMenuItem = {
      label: label.trim(),
    };

    // Parse args - split by spaces but respect quotes
    if (args.trim()) {
      const parsedArgs = args.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
      newItem.args = parsedArgs.map((arg) => arg.replace(/^"|"$/g, ""));
    }

    if (cwd.trim()) {
      newItem.cwd = cwd.trim();
    }

    if (domain.trim()) {
      newItem.domain = domain.trim();
    }

    onSave(newItem);
  };

  const applyPreset = (preset: { label: string; args: string[] }) => {
    setLabel(preset.label);
    setArgs(preset.args.join(" "));
  };

  const canSave = label.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Presets */}
      <div className="space-y-2">
        <Label>Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {SHELL_PRESETS.slice(0, 6).map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="space-y-2">
        <Label htmlFor="launch-label">Label *</Label>
        <Input
          id="launch-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., PowerShell, Ubuntu WSL"
        />
        <p className="text-xs text-muted-foreground">
          Display name shown in the launch menu
        </p>
      </div>

      {/* Args */}
      <div className="space-y-2">
        <Label htmlFor="launch-args">Program &amp; Arguments</Label>
        <Input
          id="launch-args"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          placeholder="e.g., pwsh.exe, wsl.exe -d Ubuntu"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Program path and arguments (space-separated, use quotes for paths with spaces)
        </p>
      </div>

      {/* Domain */}
      <div className="space-y-2">
        <Label htmlFor="launch-domain">Domain (Optional)</Label>
        <Input
          id="launch-domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g., WSL:Ubuntu, local"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Multiplexing domain - use WSL:DistroName for WSL
        </p>
      </div>

      {/* CWD */}
      <div className="space-y-2">
        <Label htmlFor="launch-cwd">Working Directory (Optional)</Label>
        <Input
          id="launch-cwd"
          value={cwd}
          onChange={(e) => setCwd(e.target.value)}
          placeholder="e.g., ~, /home/user, C:\\Projects"
          className="font-mono"
        />
      </div>

      {/* Buttons */}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!canSave}>
          {item ? "Update" : "Add"} Entry
        </Button>
      </DialogFooter>
    </div>
  );
}

export function LaunchMenuInput({ option }: LaunchMenuInputProps) {
  const value = useConfigStore((state) => state.getValue(option.id)) as LaunchMenuItem[];
  const setValue = useConfigStore((state) => state.setValue);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Memoize items with stable IDs
  const itemsWithIds = useMemo(() => ensureItemIds(value || []), [value]);

  const handleSave = useCallback((item: LaunchMenuItem) => {
    if (editingId !== null) {
      // Update existing - find by ID
      const index = itemsWithIds.findIndex((i) => i._id === editingId);
      if (index !== -1) {
        const newValue = [...itemsWithIds];
        newValue[index] = { ...item, _id: editingId };
        setValue(option.id, stripItemIds(newValue));
      }
      setEditingId(null);
    } else {
      // Add new with generated ID
      const newItem: LaunchMenuItemWithId = { ...item, _id: generateItemId() };
      setValue(option.id, stripItemIds([...itemsWithIds, newItem]));
      setIsAddingNew(false);
    }
  }, [editingId, itemsWithIds, option.id, setValue]);

  const handleDelete = useCallback((id: string) => {
    const newValue = itemsWithIds.filter((i) => i._id !== id);
    setValue(option.id, stripItemIds(newValue));
  }, [itemsWithIds, option.id, setValue]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsAddingNew(false);
  }, []);

  // Find the item being edited
  const editingItem = editingId
    ? itemsWithIds.find((i) => i._id === editingId) ?? null
    : null;

  return (
    <SettingWrapper option={option}>
      <div className="space-y-3">
        {/* Item List */}
        <div className="border rounded-md divide-y divide-border">
          {itemsWithIds.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No launch menu entries defined. Add entries to quickly launch different shells.
            </div>
          ) : (
            itemsWithIds.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-3 group hover:bg-muted/50"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
                <Terminal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.domain && (
                      <Badge variant="outline" className="text-xs">
                        {item.domain}
                      </Badge>
                    )}
                  </div>
                  {item.args && (
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                      {item.args.join(" ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingId(item._id)}
                    aria-label={`Edit ${item.label}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(item._id)}
                    aria-label={`Delete ${item.label}`}
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
          Add Launch Menu Entry
        </Button>

        {/* Edit/Add Dialog */}
        <Dialog
          open={editingId !== null || isAddingNew}
          onOpenChange={(open) => {
            if (!open) handleCancel();
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                {editingId !== null ? "Edit Launch Entry" : "Add Launch Entry"}
              </DialogTitle>
              <DialogDescription>
                Configure a program to appear in WezTerm&apos;s launch menu (right-click on + button).
              </DialogDescription>
            </DialogHeader>
            <LaunchMenuEditor
              item={editingItem}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </SettingWrapper>
  );
}
