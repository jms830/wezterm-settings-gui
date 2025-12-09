import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getOptionById, getDefaultValue, allOptions } from "@/data/wezterm-options";

// Type for persisted state validation
interface PersistedState {
  config: Record<string, unknown>;
  appliedTheme: string | null;
}

// Validate persisted state structure
function isValidPersistedState(state: unknown): state is PersistedState {
  if (typeof state !== "object" || state === null) return false;
  const s = state as Record<string, unknown>;
  if (typeof s.config !== "object" || s.config === null) return false;
  if (s.appliedTheme !== null && typeof s.appliedTheme !== "string") return false;
  return true;
}

export interface ConfigStore {
  // Only stores non-default (modified) values
  config: Record<string, unknown>;
  
  // Currently applied theme name
  appliedTheme: string | null;
  
  // Active category in the UI
  activeCategory: string;
  
  // Actions
  setValue: (key: string, value: unknown) => void;
  getValue: (key: string) => unknown;
  resetValue: (key: string) => void;
  resetAll: () => void;
  isModified: (key: string) => boolean;
  getModifiedCount: () => number;
  
  // Theme actions
  applyTheme: (themeName: string, colors: Record<string, unknown>) => void;
  clearTheme: () => void;
  
  // Category navigation
  setActiveCategory: (category: string) => void;
  
  // Import/Export
  importConfig: (values: Record<string, unknown>) => void;
  exportConfig: () => Record<string, unknown>;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      config: {},
      appliedTheme: null,
      activeCategory: "colors",

      setValue: (key: string, value: unknown) => {
        const defaultValue = getDefaultValue(key);
        
        set((state) => {
          const newConfig = { ...state.config };
          
          // If value equals default, remove it from stored config
          if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
            delete newConfig[key];
          } else {
            newConfig[key] = value;
          }
          
          return { config: newConfig };
        });
      },

      getValue: (key: string) => {
        const state = get();
        // Return stored value if modified, otherwise return default
        if (key in state.config) {
          return state.config[key];
        }
        return getDefaultValue(key);
      },

      resetValue: (key: string) => {
        set((state) => {
          const newConfig = { ...state.config };
          delete newConfig[key];
          return { config: newConfig };
        });
      },

      resetAll: () => {
        set({ config: {}, appliedTheme: null });
      },

      isModified: (key: string) => {
        const state = get();
        return key in state.config;
      },

      getModifiedCount: () => {
        return Object.keys(get().config).length;
      },

      applyTheme: (themeName: string, colors: Record<string, unknown>) => {
        set((state) => {
          const newConfig = { ...state.config };
          
          // Apply all color values from theme
          for (const [key, value] of Object.entries(colors)) {
            const defaultValue = getDefaultValue(key);
            if (JSON.stringify(value) !== JSON.stringify(defaultValue)) {
              newConfig[key] = value;
            } else {
              delete newConfig[key];
            }
          }
          
          return { 
            config: newConfig, 
            appliedTheme: themeName 
          };
        });
      },

      clearTheme: () => {
        set((state) => {
          const newConfig = { ...state.config };
          
          // Remove all color-related keys
          const colorKeys = allOptions
            .filter((opt) => opt.category === "colors")
            .map((opt) => opt.id);
          
          for (const key of colorKeys) {
            delete newConfig[key];
          }
          
          return { 
            config: newConfig, 
            appliedTheme: null 
          };
        });
      },

      setActiveCategory: (category: string) => {
        set({ activeCategory: category });
      },

      importConfig: (values: Record<string, unknown>) => {
        set((state) => {
          const newConfig = { ...state.config };
          
          for (const [key, value] of Object.entries(values)) {
            const option = getOptionById(key);
            if (option) {
              const defaultValue = getDefaultValue(key);
              if (JSON.stringify(value) !== JSON.stringify(defaultValue)) {
                newConfig[key] = value;
              }
            }
          }
          
          return { config: newConfig };
        });
      },

      exportConfig: () => {
        const state = get();
        const fullConfig: Record<string, unknown> = {};
        
        // Build full config with defaults + modifications
        for (const option of allOptions) {
          fullConfig[option.id] = state.getValue(option.id);
        }
        
        return fullConfig;
      },
    }),
    {
      name: "wezterm-config-storage",
      // Only persist config and appliedTheme, not UI state
      partialize: (state) => ({
        config: state.config,
        appliedTheme: state.appliedTheme,
      }),
      // Validate and merge persisted state safely
      merge: (persistedState, currentState) => {
        if (!isValidPersistedState(persistedState)) {
          console.warn("Invalid persisted state, using defaults");
          return currentState;
        }
        
        // Validate each config key exists in our options
        const validatedConfig: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(persistedState.config)) {
          const option = getOptionById(key);
          if (option) {
            validatedConfig[key] = value;
          } else {
            console.warn(`Unknown config key "${key}" in persisted state, skipping`);
          }
        }
        
        return {
          ...currentState,
          config: validatedConfig,
          appliedTheme: persistedState.appliedTheme,
        };
      },
    }
  )
);

// Stable selectors to prevent unnecessary re-renders
export const selectValue = (key: string) => (state: ConfigStore) => {
  if (key in state.config) {
    return state.config[key];
  }
  return getDefaultValue(key);
};

export const selectIsModified = (key: string) => (state: ConfigStore) => 
  key in state.config;

export const selectModifiedKeys = (state: ConfigStore) => 
  Object.keys(state.config);

export const selectModifiedCount = (state: ConfigStore) => 
  Object.keys(state.config).length;

// Type-safe selector hooks with proper defaults
export function useConfigValue<T>(key: string, defaultVal?: T): T {
  const value = useConfigStore(selectValue(key));
  return (value ?? defaultVal) as T;
}

export function useIsModified(key: string): boolean {
  return useConfigStore(selectIsModified(key));
}

export function useActiveCategory(): string {
  return useConfigStore((state) => state.activeCategory);
}

// Use shallow comparison for array/object selectors
export function useModifiedKeys(): string[] {
  return useConfigStore(selectModifiedKeys);
}
