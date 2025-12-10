"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Trash2,
  Copy,
  Check,
  Pencil,
  FolderOpen,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useConfigStore, type Profile } from "@/lib/store/config-store";

export function ProfileManager() {
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const profiles = useConfigStore((state) => state.profiles);
  const activeProfileId = useConfigStore((state) => state.activeProfileId);
  const createProfile = useConfigStore((state) => state.createProfile);
  const saveProfile = useConfigStore((state) => state.saveProfile);
  const loadProfile = useConfigStore((state) => state.loadProfile);
  const deleteProfile = useConfigStore((state) => state.deleteProfile);
  const renameProfile = useConfigStore((state) => state.renameProfile);
  const duplicateProfile = useConfigStore((state) => state.duplicateProfile);
  const config = useConfigStore((state) => state.config);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  // Check if current config differs from active profile
  const hasUnsavedChanges = activeProfile
    ? JSON.stringify(config) !== JSON.stringify(activeProfile.config)
    : Object.keys(config).length > 0;

  const handleCreate = () => {
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      setNewProfileName("");
      setIsCreateOpen(false);
    }
  };

  const handleRename = () => {
    if (selectedProfile && newProfileName.trim()) {
      renameProfile(selectedProfile.id, newProfileName.trim());
      setNewProfileName("");
      setIsRenameOpen(false);
      setSelectedProfile(null);
    }
  };

  const handleDuplicate = () => {
    if (selectedProfile && newProfileName.trim()) {
      duplicateProfile(selectedProfile.id, newProfileName.trim());
      setNewProfileName("");
      setIsDuplicateOpen(false);
      setSelectedProfile(null);
    }
  };

  const handleDelete = () => {
    if (selectedProfile) {
      deleteProfile(selectedProfile.id);
      setIsDeleteOpen(false);
      setSelectedProfile(null);
    }
  };

  const openRenameDialog = (profile: Profile) => {
    setSelectedProfile(profile);
    setNewProfileName(profile.name);
    setIsRenameOpen(true);
  };

  const openDuplicateDialog = (profile: Profile) => {
    setSelectedProfile(profile);
    setNewProfileName(`${profile.name} (Copy)`);
    setIsDuplicateOpen(true);
  };

  const openDeleteDialog = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsDeleteOpen(true);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="h-8">
          <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
          <span className="text-xs">Profiles</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="text-xs max-w-[100px] truncate">
                {activeProfile ? activeProfile.name : "No Profile"}
              </span>
              {hasUnsavedChanges && activeProfile && (
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              )}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {profiles.length === 0 ? (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                No profiles yet
              </div>
            ) : (
              profiles.map((profile) => (
                <DropdownMenuItem
                  key={profile.id}
                  className="flex items-center justify-between group"
                  onClick={() => loadProfile(profile.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {profile.id === activeProfileId && (
                      <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    )}
                    <span className="truncate">{profile.name}</span>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRenameDialog(profile);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDuplicateDialog(profile);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(profile);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeProfile && hasUnsavedChanges && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => saveProfile(activeProfile.id)}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Save</span>
          </Button>
        )}
      </div>

      {/* Create Profile Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Save your current configuration as a new profile.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newProfileName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Profile Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Profile</DialogTitle>
            <DialogDescription>
              Enter a new name for this profile.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!newProfileName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Profile Dialog */}
      <Dialog open={isDuplicateOpen} onOpenChange={setIsDuplicateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Profile</DialogTitle>
            <DialogDescription>
              Create a copy of &ldquo;{selectedProfile?.name}&rdquo; with a new name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDuplicate()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDuplicateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDuplicate} disabled={!newProfileName.trim()}>
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedProfile?.name}&rdquo;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
