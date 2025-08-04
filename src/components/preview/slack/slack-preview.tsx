import { SlackTheme } from '@/lib/providers/slack';
import { useThemeContext } from '@/providers/theme';

interface SlackPreviewProps {
  theme: { light: SlackTheme; dark: SlackTheme };
  className?: string;
}

export function SlackPreview({ theme, className }: SlackPreviewProps) {
  const { currentMode } = useThemeContext();
  const currentTheme = currentMode === 'dark' ? theme.dark : theme.light;
  
  // Use actual Slack theme colors
  const slackColors = {
    sidebar: currentTheme.column_bg,
    sidebarText: currentTheme.text_color,
    activeItem: currentTheme.active_item,
    activeItemText: currentTheme.active_item_text,
    hoverItem: currentTheme.hover_item,
    textInput: currentTheme.menu_bg,
    messageText: currentTheme.text_color,
    background: currentTheme.menu_bg,
    topNavBg: currentTheme.top_nav_bg,
    topNavText: currentTheme.top_nav_text,
    accent: currentTheme.accent_color,
    mentionBadge: currentTheme.mention_badge,
    activePresence: currentTheme.active_presence,
  };

  return (
    <div 
      className={`rounded-lg border overflow-hidden ${className || ''}`}
      style={{ backgroundColor: slackColors.background }}
    >
      {/* Slack header */}
      <div 
        className="px-4 py-2 border-b flex items-center justify-between"
        style={{ backgroundColor: slackColors.sidebar, color: slackColors.sidebarText }}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-purple-600 font-bold text-sm">S</span>
          </div>
          <div className="text-sm font-medium">Tinte Workspace</div>
        </div>
        <div className="text-xs opacity-75">
          {currentMode} theme preview
        </div>
      </div>

      <div className="flex h-80">
        {/* Sidebar */}
        <div 
          className="w-64 border-r flex flex-col"
          style={{ backgroundColor: slackColors.sidebar, color: slackColors.sidebarText }}
        >
          {/* Sidebar header */}
          <div className="p-3 border-b border-white/10">
            <div className="text-sm font-medium">Tinte Workspace</div>
            <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Online
            </div>
          </div>

          {/* Channels */}
          <div className="flex-1 p-2">
            <div className="text-xs opacity-75 mb-2 px-2">Channels</div>
            <div className="space-y-1">
              <div 
                className="px-2 py-1 rounded text-sm cursor-pointer"
                style={{ backgroundColor: slackColors.activeItem }}
              >
                # general
              </div>
              <div 
                className="px-2 py-1 rounded text-sm cursor-pointer hover:bg-white/10"
                style={{ backgroundColor: 'transparent' }}
              >
                # design-system
              </div>
              <div 
                className="px-2 py-1 rounded text-sm cursor-pointer hover:bg-white/10"
                style={{ backgroundColor: 'transparent' }}
              >
                # theme-feedback
              </div>
            </div>

            <div className="text-xs opacity-75 mb-2 px-2 mt-4">Direct Messages</div>
            <div className="space-y-1">
              <div className="px-2 py-1 rounded text-sm cursor-pointer hover:bg-white/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Alice Designer
              </div>
              <div className="px-2 py-1 rounded text-sm cursor-pointer hover:bg-white/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Bob Developer
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: slackColors.background }}>
          {/* Channel header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium" style={{ color: slackColors.messageText }}># general</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-500">3 members</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Message 1 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium" style={{ color: slackColors.messageText }}>Alice Designer</span>
                    <span className="text-xs text-gray-500">2:30 PM</span>
                  </div>
                  <div className="text-sm" style={{ color: slackColors.messageText }}>
                    Hey team! I've been working on the new theme system. What do you think of these colors?
                  </div>
                </div>
              </div>

              {/* Message 2 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-medium">
                  B
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium" style={{ color: slackColors.messageText }}>Bob Developer</span>
                    <span className="text-xs text-gray-500">2:32 PM</span>
                  </div>
                  <div className="text-sm" style={{ color: slackColors.messageText }}>
                    Looking great! The contrast ratios are perfect for accessibility. 👍
                  </div>
                </div>
              </div>

              {/* Theme colors showcase */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-sm font-medium">
                  T
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium" style={{ color: slackColors.messageText }}>Tinte Bot</span>
                    <span className="text-xs text-gray-500">2:33 PM</span>
                  </div>
                  <div className="text-sm mb-2" style={{ color: slackColors.messageText }}>
                    Current theme colors:
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: slackColors.sidebar }} title="Sidebar" />
                    <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: slackColors.activeItem }} title="Active Item" />
                    <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: slackColors.hoverItem }} title="Hover Item" />
                    <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: slackColors.textInput }} title="Text Input" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div 
              className="border rounded-lg p-3"
              style={{ 
                backgroundColor: slackColors.textInput,
                borderColor: slackColors.activeItem + '50'
              }}
            >
              <div className="text-sm text-gray-500">Message #general</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}