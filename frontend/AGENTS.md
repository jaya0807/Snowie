<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# UI & Styling Guidelines

**trigger**: `model_decision` when modifying UI components in the `frontend/` directory.

CRITICAL RULES for modifying or creating UI components in this project:

1. **NO HARDCODED COLORS**: Never use arbitrary hex codes (e.g., `bg-[#176B9C]`, `text-[#FF9BAA]`) in any `.tsx` file.
2. **SINGLE SOURCE OF TRUTH**: All colors must use semantic Tailwind tokens mapped in `frontend/src/app/globals.css` (inside the `@theme inline` block).
3. **AVAILABLE TOKENS**: 
   - **Brand**: `brand`, `brand-dark`, `brand-muted`, `brand-light`, `brand-accent`, `brand-surface`, `brand-surface-alt`, `brand-border`, `brand-blue`, `brand-blue-dark`, `brand-blue-light`
   - **Status**: `success`, `success-bg`, `success-light`, `success-alt`, `success-alt-bg`, `warning`, `warning-bg`, `warning-light`, `danger`, `danger-bg`, `danger-light`
   - **Marketing**: `marketing-bg`, `marketing-dark`, `marketing-muted`, `marketing-muted-alt`
   - **Base**: `background`, `white`, `zinc-100`, `teal-200`, `indigo-100`
4. **OPACITIES**: Use Tailwind's native opacity syntax with the semantic tokens (e.g., `bg-brand/10` instead of `rgba(...)` or hardcoding a lighter variant if not necessary).
5. **ELEVATION/CARDS**: Use the `.glass` class (defined in `globals.css`) for elevated cards to ensure the box-shadow and background perfectly match the Stripe-inspired styling.
