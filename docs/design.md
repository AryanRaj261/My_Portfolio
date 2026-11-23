# Design System

## Creative direction

The portfolio uses a dark editorial landscape in the hero, then moves through warm paper, blue, and black sections. The visual language is intentionally cinematic, but the content hierarchy stays direct and readable.

## Design principles

1. Make the work and contact path easy to find.
2. Use motion to guide attention, not to hide content.
3. Keep text contrast and keyboard interaction reliable.
4. Present concepts honestly; do not imply client ownership or public links that do not exist.
5. Respect `prefers-reduced-motion`.

## Typography and layout

- Display headings use a high-contrast editorial serif treatment.
- Body, labels, and navigation use a clean sans/mono pairing.
- Sections use generous vertical rhythm, with responsive grids collapsing to one column on smaller screens.
- Small uppercase labels communicate sequence and context.

## Motion

- Framer Motion handles entrance transitions, image swaps, navigation sheet animation, and subtle pointer parallax.
- Canvas and iframe studies manage their own authored motion.
- Do not add autoplaying motion that prevents reading, blocks controls, or ignores reduced-motion preferences.

## Component conventions

- Buttons and links require visible focus behavior and descriptive accessible names.
- Project selection is a keyboard-operable tab interface.
- Decorative layers use `aria-hidden`; meaningful images must include useful alt text.
- New sections should reuse existing spacing, eyebrow, line-link, and section-heading patterns before introducing new visual primitives.

## Visual QA checklist

- Check desktop and 390px-wide mobile layouts.
- Confirm navigation, project tabs, contact actions, chatbot, and study controls work by keyboard.
- Check contrast after changing background colors.
- Verify that interactive study wrappers retain a defined height when lazy-loaded.
