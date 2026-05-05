export function normalizeTag(tag: string): string {
  // Lotsa regex, i just let gemini take the wheel on this one,
  // im trying to learn nestjs not regex, that sounds like a nightmare,
  // but maybe next time.
  if (!tag) return '';

  return (
    tag
      // 1. Deconstruct diacritics (e.g., "Pokémon" -> "Pokemon", "Café" -> "Cafe")
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

      // 2. Lowercase everything
      .toLowerCase()

      // 3. Keep all global letters, numbers, &, /, _, -, and spaces
      // Note: We added `-` so "Spider-Man" doesn't become "spiderman",
      // but you can remove the `\-` if you prefer squashing them.
      .replace(/[^\p{L}\p{N}&/_ \-]/gu, '')

      // 4. Standardize spacing around relationship delimiters like '/' and '&'
      // Converts "luz  /amity" or "luz/amity" to canonical "luz / amity"
      .replace(/\s*([/&])\s*/g, ' $1 ')

      // 5. Replace dashes and underscores with spaces (Optional, but good for standardization)
      .replace(/[_-]+/g, ' ')

      // 6. Collapse multiple spaces and trim edges
      .replace(/\s+/g, ' ')
      .trim()
  );
}
