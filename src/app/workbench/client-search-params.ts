import {
  parseAsBoolean,
  parseAsStringLiteral
} from 'nuqs'

// Client-side parsers for workbench
export const workbenchParsers = {
  new: parseAsBoolean.withDefault(false),
  tab: parseAsStringLiteral(['agent', 'colors', 'tokens'] as const).withDefault('colors' as const)
}