// Canvas text utilities for intelligent text wrapping

/**
 * Wraps text to fit within a maximum width, breaking at word boundaries
 * Returns the number of lines used
 */
export const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      // Line is full, draw it and start a new line
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
      lineCount++;
    } else {
      line = testLine;
    }
  }

  // Draw the last line
  if (line.trim().length > 0) {
    ctx.fillText(line.trim(), x, currentY);
    lineCount++;
  }

  return lineCount;
};

/**
 * Calculates how many lines the text will occupy
 * without actually drawing it
 */
export const calculateTextLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): number => {
  const words = text.split(' ');
  let line = '';
  let lineCount = 1;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lineCount++;
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }

  return lineCount;
};

/**
 * Calculates the total height needed for a card with multiple bullets
 */
export const calculateCardHeight = (
  ctx: CanvasRenderingContext2D,
  bullets: Array<{ icon?: string; text: string }>,
  maxWidth: number,
  font: string
): number => {
  const baseHeight = 60; // Title + padding
  const lineHeight = 22;
  const bulletSpacing = 4; // Extra space between bullets
  let totalLines = 0;

  // Set font for measurement
  const originalFont = ctx.font;
  ctx.font = font;

  bullets.forEach((bullet) => {
    const lines = calculateTextLines(ctx, bullet.text, maxWidth);
    totalLines += lines;
  });

  // Restore original font
  ctx.font = originalFont;

  // Calculate total height: base + (lines * lineHeight) + (bullets * spacing) + bottom padding
  const bulletCount = bullets.length;
  return baseHeight + (totalLines * lineHeight) + (bulletCount * bulletSpacing) + 20;
};
