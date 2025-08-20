import {
  parseAsBoolean,
  parseAsStringLiteral
} from 'nuqs'

// Client-side parsers for workbench
export const workbenchParsers = {
  new: parseAsBoolean.withDefault(false),
  tab: parseAsStringLiteral(['chat', 'design', 'mapping'] as const).withDefault('chat' as const)
}