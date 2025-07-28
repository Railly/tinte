# Chat Feature Implementation

## Overview

The chat feature provides a seamless flow from the prompt input to a dedicated chat interface with theme preview. It's designed for anonymous users with no backend requirements.

## Architecture

### Flow

1. **PromptInput** compiles `{content, attachments}` from `usePastedItems` state
2. **Storage** writes a short-lived seed to storage (sessionStorage + localStorage TTL)
3. **Navigation** uses `router.push('/chat/[id]')` for seamless transition
4. **ChatPage** reads the seed, renders the first user bubble + attachments
5. **Animation** After ~1.5s, animates layout: chat rail to 24rem with right preview

### Key Components

#### 1. Types & Mappers (`src/utils/seed-mapper.ts`)

- `Attachment`: Maps pasted items to chat attachments
- `SeedPayload`: Contract for storage data
- `mapPastedToAttachments()`: Converts UI state to storage format

#### 2. Storage Layer (`src/utils/anon-seed.ts`)

- **SessionStorage**: Same-tab UX
- **LocalStorage**: Reload-safe with 15-minute TTL
- **Fallback**: Graceful degradation if storage fails

#### 3. Enhanced PromptInput (`src/components/home/prompt-input/prompt-input.tsx`)

- **Submit Logic**: Builds payload → writes seed → navigates
- **Button State**: Enabled when content or attachments exist
- **Data Flow**: Preserves all pasted items and prompt text

#### 4. Chat Interface (`src/app/chat/[id]/page.tsx`)

- **Layout**: Responsive split with animated transitions
- **Attachments**: Rich rendering for images, palettes, URLs, configs
- **Preview**: Right panel for theme preview (placeholder)

## Features

### Anonymous & Stateless

- No authentication required
- Client-side only
- Sharable URLs
- Reload-safe for 15 minutes

### Rich Attachments

- **Images**: Base64 with size limits
- **Palettes**: Color grid with hex values
- **URLs**: Clean display with metadata
- **Configs**: Syntax-highlighted code blocks
- **Text**: Formatted content blocks

### Smooth UX

- **Loading States**: Proper async handling
- **Animations**: Spring-based transitions
- **Responsive**: Mobile-friendly layout
- **Navigation**: Back button support

## Usage

1. **Input Content**: Add text, images, palettes, or configs
2. **Submit**: Click arrow or press Enter
3. **Navigate**: Automatically redirects to chat
4. **View**: See your content in chat format
5. **Preview**: Theme preview appears after 1.6s

## Technical Details

### Storage Strategy

```typescript
// SessionStorage for immediate access
sessionStorage.setItem(`seed:${id}`, JSON.stringify(payload));

// LocalStorage for reload safety (with TTL)
localStorage.setItem(`seed:${id}`, JSON.stringify(payload));
```

### Animation Timing

- **Initial**: Full-width chat
- **Delay**: 1600ms for user to read content
- **Transition**: Spring animation to split layout
- **Preview**: Fade-in with slide effect

### Error Handling

- **Invalid URLs**: Graceful fallback
- **Storage Limits**: Size caps on images
- **Missing Seeds**: Clear error messages
- **Type Safety**: Full TypeScript coverage

## Future Enhancements

- [ ] Reply functionality
- [ ] Theme generation in preview
- [ ] Export capabilities
- [ ] Persistent chat history
- [ ] Real-time collaboration
