-- WezTerm configuration
local wezterm = require 'wezterm'
local config = {}

-- Include modular config
local appearance = require('config.appearance')

config.font_size = 14
config.color_scheme = 'Tokyo Night'
config.enable_tab_bar = true
config.window_background_opacity = 0.95

-- Colors from appearance module get merged
for k, v in pairs(appearance.colors or {}) do
  if not config.colors then config.colors = {} end
  config.colors[k] = v
end

return config
