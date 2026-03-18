# Titanium Masterwork UI/UX Enhancement Proposal - Omnicart

## Phase 1: Surgical Audit Result
The project is a robust B2C E-commerce platform with an existing foundation of **Framer Motion** and **Tailwind CSS**. It already utilizes some Titanium DNA (3D Tilt, Magnetic effects). 

### Recommended Archetype
**Fluid Consumer (Masterwork Edition)**
This archetype focuses on high-speed visual feedback, soft glassmorphism, and fluid transitions that feel "expensive".

## Proposed Enhancements Table

| ID | Enhancement | Component/File | Impact |
| :--- | :--- | :--- | :--- |
| TM-01 | **OKLCH Vibrant Tokens** | `index.css` | Premium P3 color range and consistent luminance. |
| TM-02 | **Haptic Rebound Buttons** | `tailwind.config.js` | Tactile "popping" feel for all interactive elements. |
| TM-03 | **Glass-Bento Product Cards** | `ProductCard.jsx` | Clearer hierarchy and modern "Linear" style glass effects. |
| TM-04 | **Fluid Page Transitions** | `AppRoutes.jsx` | Removes jarring jumps between shopping categories. |
| TM-05 | **Luminous Navbar** | `Navbar.jsx` | Moving highlight effect that reacts to cursor position. |

## Next Steps
- [ ] Inject Masterwork DNA into `index.css` and `tailwind.config.js`.
- [ ] Refactor `ProductCard.jsx` for the new Glass-Bento look.
- [ ] Implement `AnimatePresence` in the routing layer.

---
*Status: Awaiting User Approval to proceed to Phase 2 (DNA Injection).*
