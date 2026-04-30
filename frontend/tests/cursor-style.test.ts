import { describe, expect, it } from 'vitest';
// @ts-ignore - Vitest 运行在 Node 环境，项目当前未显式声明 @types/node。
import { readFileSync } from 'node:fs';
// @ts-ignore - 同上。
import { dirname, resolve } from 'node:path';
// @ts-ignore - 同上。
import { fileURLToPath } from 'node:url';

const styles = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../src/styles.css'), 'utf8');

describe('custom cursor styles', () => {
  it('only applies decorative cursors on fine pointers and keeps text inputs native', () => {
    expect(styles).toContain('@media (pointer: fine)');

    expect(styles).toMatch(
      /@media\s*\(pointer:\s*fine\)[\s\S]*body\s*{[\s\S]*cursor:\s*url\("data:image\/svg\+xml,[^"]+"\)\s+\d+\s+\d+,\s*auto;/
    );
    expect(styles).toMatch(
      /@media\s*\(pointer:\s*fine\)[\s\S]*a\[href\],[\s\S]*button:not\(:disabled\),[\s\S]*\.back-home-link[\s\S]*cursor:\s*url\("data:image\/svg\+xml,[^"]+"\)\s+\d+\s+\d+,\s*pointer;/
    );
    const clickableCursorRule = styles.match(
      /a\[href\],[\s\S]*?summary\s*{[\s\S]*?cursor:\s*url\("data:image\/svg\+xml,[^"]+"\)\s+\d+\s+\d+,\s*pointer;[\s\S]*?}/
    )?.[0];
    expect(clickableCursorRule).toBeTruthy();
    expect(clickableCursorRule).not.toContain('.story-card');
    expect(clickableCursorRule).not.toContain('.story-photo');
    expect(clickableCursorRule).not.toContain('.album-photo');
    expect(styles).toMatch(
      /@media\s*\(pointer:\s*fine\)[\s\S]*input,[\s\S]*textarea\s*{[\s\S]*cursor:\s*text;/
    );
  });

  it('hides decorative gif stickers when reduced motion is requested', () => {
    expect(styles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.edge-bubu-layer\s*{[\s\S]*display:\s*none;/
    );
  });

  it('shows a visible focus state for the hidden avatar upload input', () => {
    expect(styles).toMatch(
      /\.avatar-upload\s+input:focus-visible\s*\+\s*span\s*{[\s\S]*(outline|box-shadow):/
    );
  });
});
