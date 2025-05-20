# OramaChain Website Documentation

## Overview
The OramaChain website is a modern, interactive web platform showcasing an AI-native blockchain solution for fleet management. The site features a sleek design with animated components, responsive layouts, and a cohesive brand identity centered around the OramaChain logo and color scheme.

## Technology Stack
- **Framework**: Next.js with React 
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Scroll Effects**: Custom scroll animations

## Color Palette

### Primary Colors
- **Purple/Violet**: `#683cec` - Primary brand color used for buttons, highlights, and accents
- **Dark Purple**: `#291859` - Used for dashboard header and sidebar
- **Teal**: `#32C8CD` - Used in gradients and route indicators

### Secondary Colors
- **Purple Light**: `#9747FF` - Used for secondary elements and route indicators
- **White**: `#FFFFFF` - Background color for cards and sections
- **Near Black**: `#111827` - Primary text color
- **Gray**: `#556068` - Secondary text color

### Gradient
The site features a gradient used in the "AI-Native" text and logo:
- Start: `#32C8CD` (Teal)
- End: `#683cec` (Purple)

## Typography

### Font Families
- **Display Font**: Used for headings and logo (sans-serif font)
- **Body Font**: Default system font stack for body text

### Font Sizes
- Headline (Hero): `text-4xl md:text-5xl lg:text-7xl`
- Section Headings: `text-4xl md:text-5xl`
- Subheadings: `text-2xl`
- Card Titles: `text-xl`
- Dashboard Elements: `text-sm` to `text-base`
- Body Text: `text-lg md:text-xl`
- Small Text: `text-xs` to `text-sm`

## Key Components

### Header
- Fixed position with scroll-aware sizing
- Transparent background with blur effect on scroll
- Navigation links with active state indicators
- Language selector and CTA button
- Collapsible mobile menu
- OramaChain logo integration

### Hero Section
- Animated headline with highlighted "AI-Native" text
- Concise value proposition
- CTA buttons for conversion
- Interactive 3D dashboard mockup that appears on scroll
- Particles background with subtle animation

### Dashboard Visualization
- Realistic fleet management interface
- Interactive map with animated route lines
- Live tracking indicators with pulse animations
- Stats cards showing fleet metrics
- OramaChain branding throughout

### Content Sections
- Feature showcase with pinning effect
- "Why OramaChain?" section with value propositions
- Supply chain solutions presentation
- Tech stack grid
- Testimonials section
- Before/after comparison carousel

### Footer
- Navigation links
- Social media integration
- Legal information

## Special Effects
- Smooth scroll behavior
- Reveal animations on scroll
- Parallax backgrounds
- Floating light effects with blur
- Interactive elements with hover states
- Cursor customization
- Text animations
- Dashboard perspective tilt on mouse movement

## Branding Elements
- OramaChain logo appears in:
  - Header (dark version)
  - Dashboard UI (light version)
  - "Why OramaChain?" section (dark version)
- Consistent use of purple (#683cec) as primary brand color
- Gradient text for emphasis
- Star symbol (✦) used as a decorative element

## Responsive Design
- Mobile-first approach with breakpoints for larger screens
- Collapsible mobile navigation
- Adjusted font sizes and spacing for different viewports
- Optimized layout for desktop, tablet, and mobile devices

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure
- `/app`: Next.js app directory containing pages and layouts
- `/components`: Reusable UI components
- `/public`: Static assets including images and logos
- `/utils`: Utility functions and helpers
- `/types`: TypeScript type definitions

## Design Assets
- Logo files available in `/public/logo/` directory
- SVG icons and illustrations in `/public/images/`
