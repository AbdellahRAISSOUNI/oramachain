# OramaChain Design System Documentation

## Brand Overview
OramaChain is an AI-native blockchain platform designed for fleet management and logistics optimization. The visual identity reflects cutting-edge technology with a clean, premium aesthetic centered around the brand's distinctive purple (#683cec) color.

## Color System

### Primary Colors
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Purple | #683cec | rgb(104, 60, 236) | Primary brand color, buttons, accents |
| Dark Purple | #291859 | rgb(41, 24, 89) | Dashboard header, sidebar backgrounds |
| Teal | #32C8CD | rgb(50, 200, 205) | Gradient component, secondary accents |

### Secondary Colors
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Light Purple | #9747FF | rgb(151, 71, 255) | Secondary elements, routes |
| White | #FFFFFF | rgb(255, 255, 255) | Backgrounds, cards |
| Near Black | #111827 | rgb(17, 24, 39) | Primary text |
| Gray | #556068 | rgb(85, 96, 104) | Secondary text |

### Gradients
Our primary gradient transitions from teal to purple:
```css
background: linear-gradient(135deg, #32C8CD 0%, #683cec 100%);
```

This gradient is used in the logo, "AI-Native" text highlight, and select UI elements.

## Typography

### Font Hierarchy
The type system uses a simple hierarchy with sans-serif fonts:

| Type | Font | Weights | Usage |
|------|------|---------|-------|
| Display | Sans-serif | Bold (700) | Headlines, large text |
| Body | System fonts | Regular (400), Medium (500) | Body copy, UI elements |

### Size Scale
```
xs: 0.75rem (12px)
sm: 0.875rem (14px)
base: 1rem (16px)
lg: 1.125rem (18px)
xl: 1.25rem (20px)
2xl: 1.5rem (24px)
3xl: 1.875rem (30px)
4xl: 2.25rem (36px)
5xl: 3rem (48px)
6xl: 3.75rem (60px)
7xl: 4.5rem (72px)
```

### CSS Classes
```css
.font-display { /* For headlines */
  font-family: var(--font-display);
  font-weight: 700;
}

.gradient-text { /* For gradient text */
  background: linear-gradient(135deg, #32C8CD 0%, #683cec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## UI Components

### Buttons

#### Primary Button
```html
<button class="px-8 py-4 rounded-full bg-[#683cec] text-white text-lg font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-[#683cec]/20">
  Get started
</button>
```

#### Secondary Button
```html
<button class="px-8 py-4 rounded-full bg-white text-[#111827] border border-gray-200 text-lg font-medium hover:bg-gray-50 transition-all shadow-sm">
  Book a demo
</button>
```

### Navigation

#### Desktop Nav Link
```html
<a class="relative px-4 py-2 text-sm font-medium text-[#111827] hover:text-[#683cec] transition-all">
  Link Text
  <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#683cec] transition-all duration-300 group-hover:w-1/2"></span>
</a>
```

#### Active Nav Link
```html
<a class="px-4 py-2 text-sm font-medium bg-white text-[#683cec] rounded-full shadow-sm border border-gray-100">
  Active Link
</a>
```

### Cards

#### Info Card
```html
<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
  <div class="flex items-center justify-between mb-3">
    <h3 class="text-sm font-medium text-gray-500">Card Title</h3>
    <div class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">+12%</div>
  </div>
  <div class="text-3xl font-bold text-[#291859]">152</div>
</div>
```

### Dashboard Elements

#### Progress Bar
```html
<div class="relative h-12 bg-gray-100 rounded-full overflow-hidden">
  <div class="absolute left-0 top-0 bottom-0 bg-[#683cec] rounded-full" style="width: 72%"></div>
  <div class="absolute inset-0 flex items-center justify-end px-3">
    <span class="text-xs font-semibold text-gray-700">72%</span>
  </div>
</div>
```

#### Map Indicator
```html
<div class="absolute h-4 w-4 rounded-full bg-[#683cec] shadow-lg shadow-[#683cec]/30">
  <div class="absolute inset-0 rounded-full bg-[#683cec] animate-ping opacity-50"></div>
</div>
```

## Animation Guidelines

### Transitions
- Button hover: 0.2s duration
- Text hover: 0.3s duration
- Navigation transitions: 0.3-0.5s duration

### Scroll Animations
- Fade-in elements: 0.5-0.6s duration with 0.1-0.3s staggered delays
- Dashboard appearance: Transform values tied to scroll position
- Text reveal: Use staggered delays for words in headlines

### Hover Effects
- Buttons: Scale to 1.02-1.03x on hover
- Cards: Subtle shadow expansion
- Navigation: Underline expansion animation

## Logo Usage

### Logo Variations
- Dark version on light backgrounds: `/logo/logo-icon-dark-transparent.png`
- Light version on dark backgrounds: `/logo/logo-icon-light-transparent.png`
- Fallback SVG version: `/images/logo.svg`

### Clearance Area
Always maintain spacing around the logo equal to the height of the "O" in the logo mark.

### Minimum Size
Minimum display size is 24px in height to maintain legibility.

## Responsive Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Accessibility Guidelines

- Maintain minimum contrast ratio of 4.5:1 for text
- All interactive elements must be keyboard accessible
- Focus states must be visible
- Text should be resizable up to 200% without loss of functionality

## Implementation Notes

- Use Framer Motion for complex animations
- Implement smooth scrolling with custom scroll handlers
- Use Next.js Image component for optimized image loading
- Maintain responsive design across all breakpoints 