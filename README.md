# WezTerm Settings GUI

A visual configuration editor for [WezTerm](https://wezfurlong.org/wezterm/) terminal emulator. Configure your terminal settings with a modern web interface and export a ready-to-use `wezterm.lua` configuration file.

## Live Demo

**[wezterm-settings.vercel.app](https://wezterm-settings.vercel.app)** *(coming soon)*

## Features

- **Visual Settings Editor** - Configure fonts, colors, window behavior, cursor styles, GPU settings, and more
- **16 Pre-built Color Schemes** - Choose from popular themes like Catppuccin, Dracula, Tokyo Night, and more
- **Live Terminal Preview** - See your changes in real-time with an embedded terminal preview
- **Custom Keybindings** - Create and edit keybindings with a visual key capture interface
- **Import/Export** - Import existing `wezterm.lua` configs and export your customizations
- **Command Palette** - Quick search across all settings with `Cmd/Ctrl + K`
- **Persistent State** - Your settings are saved in your browser automatically

## Usage

1. Visit the web app
2. Configure your settings using the visual interface
3. Click **Export** to download your `wezterm.lua` file
4. Place the file in your WezTerm config directory:
   - **Linux/macOS**: `~/.wezterm.lua` or `~/.config/wezterm/wezterm.lua`
   - **Windows**: `%USERPROFILE%\.wezterm.lua`

## Development

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Run linting
bun run lint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui (Radix primitives)
- **State**: Zustand with localStorage persistence
- **Terminal Preview**: xterm.js
- **Package Manager**: Bun

## Roadmap

- [ ] Companion CLI for direct file system access (`npx wezterm-settings`)
- [ ] More WezTerm options coverage
- [ ] Keybinding conflict detection
- [ ] Undo/Redo support
- [ ] Drag-and-drop keybinding reorder

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
