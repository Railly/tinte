import { parseAsString, parseAsBoolean, createSearchParamsCache } from 'nuqs/server';

// Shared parsers for theme form
export const themeFormParsers = {
  create: parseAsString,
  edit: parseAsString,
};

// Shared parsers for theme search and filters
export const themeSearchParsers = {
  q: parseAsString.withDefault(''),
  publicOnly: parseAsBoolean.withDefault(false),
};

// Server-side caches
export const themeFormCache = createSearchParamsCache(themeFormParsers);
export const themeSearchCache = createSearchParamsCache(themeSearchParsers);