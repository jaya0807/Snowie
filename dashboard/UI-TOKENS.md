# OBSERVE AI - UI Design Token Library

This library defines the reusable **Glassmorphism Design Tokens** used across the application. By standardizing these variables, you can globally adjust the "frostedness", borders, and depth of the entire UI by modifying just one variable.

## CSS Variables (`globals.css`)
These are defined in the `:root` scope and power all glass utility classes.

- `--glass-start`: The starting opacity of the glass gradient (default: `rgba(255, 255, 255, 0.10)`)
- `--glass-end`: The ending opacity of the glass gradient (default: `rgba(255, 255, 255, 0.05)`)
- `--glass-border-light`: Used for the top/left borders to create directional 3D lighting (default: `rgba(255, 255, 255, 0.20)`)
- `--glass-border-dark`: Used for the bottom/right base borders (default: `rgba(255, 255, 255, 0.05)`)
- `--glass-blur-sm`: Used for small UI elements (default: `12px`)
- `--glass-blur-md`: Used for large panels and cards (default: `24px`)

## Utility Classes
Apply these custom Tailwind `@utility` classes to React components to instantly render the standardized UI theme.

| Utility Class | Best Used For | Description |
|---|---|---|
| `glass` | Small UI components, buttons, list items | A baseline frosted glass with subtle borders. |
| `glass-panel` | Base cards, sidebars, headers | Fades out to transparent at the bottom. Highly blurred. |
| `glass-light` | Highlighted KPI cards | Uniform fade across the entire background. Brightest panel. |
| `glass-dark` | Deep recessed containers (charts) | Extremely dark translucent background (`0.6` black). |

### Overriding Tokens Inline
If you need a specific card to have a slightly different opacity but maintain the standard directional borders, simply override the CSS variable inline:
```tsx
<Card className="glass-panel" style={{ '--glass-start': 'rgba(255, 255, 255, 0.08)' } as React.CSSProperties}>
```
