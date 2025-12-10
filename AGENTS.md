# wezterm-settings-gui Development Guidelines

A web-based WezTerm configuration editor built with Next.js 15, React 19, and Tailwind CSS v4.

Last updated: 2025-12-09

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui (Radix primitives)
- **State**: Zustand 5 with persistence
- **Terminal Preview**: xterm.js
- **Package Manager**: Bun

## Project Structure

```text
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main editor layout
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Tailwind imports & theme variables
├── components/
│   ├── editor/            # Main editor components
│   │   ├── ExportPanel.tsx
│   │   ├── SearchCommand.tsx
│   │   ├── SettingsPanel.tsx
│   │   └── Sidebar.tsx
│   ├── preview/           # Terminal preview
│   │   └── TerminalPreview.tsx
│   ├── settings/          # Setting input components
│   │   ├── ColorInput.tsx
│   │   ├── KeybindInput.tsx
│   │   ├── NumberInput.tsx
│   │   ├── PaletteInput.tsx
│   │   ├── SelectInput.tsx
│   │   ├── SettingRenderer.tsx
│   │   ├── SettingWrapper.tsx
│   │   ├── SwitchInput.tsx
│   │   ├── TextInput.tsx
│   │   └── ThemePicker.tsx
│   └── ui/                # shadcn/ui primitives
├── data/
│   ├── categories.ts      # Category definitions with icons
│   ├── color-schemes.ts   # Pre-built color themes
│   └── wezterm-options.ts # All WezTerm config options
├── lib/
│   ├── export/
│   │   ├── lua-generator.ts  # Generate wezterm.lua output
│   │   └── lua-parser.ts     # Parse existing configs
│   ├── schema/
│   │   └── types.ts       # TypeScript types for options
│   ├── store/
│   │   └── config-store.ts   # Zustand store
│   └── utils.ts           # Utility functions (cn, etc.)
```

## Commands

```bash
# Development
bun dev              # Start dev server at localhost:3000

# Build & Production
bun run build        # Build for production
bun start            # Start production server

# Linting
bun run lint         # Run ESLint
```

## Code Style

- **TypeScript**: Strict mode, explicit return types for exported functions
- **Components**: Functional components with `"use client"` directive where needed
- **Imports**: Use `@/` path alias for src directory
- **State**: Use Zustand selectors to prevent unnecessary re-renders
- **Styling**: Tailwind utility classes, use `cn()` for conditional classes

## Key Patterns

### Adding a New Setting Option

1. Add the option definition to `src/data/wezterm-options.ts`
2. Ensure the correct type interface in `src/lib/schema/types.ts`
3. The `SettingRenderer` will automatically render the correct input component

### Hydration Safety

For components that read from persisted Zustand state, use the mounted pattern:
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
// Only render dynamic content after mounted
{mounted && <DynamicContent />}
```

### Lua Export

The `lua-generator.ts` handles converting the config store to valid Lua syntax. Special cases:
- Keybindings use `wezterm.action.*` format
- Color palettes are Lua arrays
- "Disabled" enum values are skipped

## Current Features

- [x] 9 setting categories (Fonts, Colors, Window, Cursor, GPU, Keybindings, General, Shell, Advanced)
- [x] 16 pre-built color schemes with live preview
- [x] Custom keybinding editor with key capture
- [x] Real-time terminal preview (xterm.js)
- [x] Import/Export Lua configuration
- [x] Command palette search (⌘K)
- [x] Persistent state (localStorage)
- [x] Reset all / Reset individual settings

## Known Issues

- Hydration warning in ScrollAreaViewport (cosmetic, doesn't affect functionality)
- Some `<label>` accessibility warnings in console

## Future Enhancements

- Drag-and-drop keybinding reorder
- Undo/Redo support
- Keybinding conflict detection
- More WezTerm options coverage
- Optional Tauri wrapper for native file system access
