## Packages
framer-motion | Essential for the smooth cinematic horizontal scroll, page transitions, and micro-interactions requested.
clsx | Utility for constructing className strings conditionally.
tailwind-merge | Utility to merge tailwind classes without style conflicts.
react-hook-form | Form state management for the contact form.
@hookform/resolvers | Zod resolver for form validation matching backend schema.

## Notes
- Images are imported statically from `@assets/` as specified in the prompt.
- Contact form uses `POST /api/contact` via standard React Query mutation.
- Using a vertical-to-horizontal scroll mapping technique via Framer Motion for a premium, cinematic "swipe/slide" feel on both desktop and mobile.
