# Design Document

## Overview

The We Care Wellness website will be a single-page React application built with TypeScript and styled using Tailwind CSS. The design emphasizes accessibility, compassion, and professionalism through a clean, modern interface with calming colors and professional stock imagery. The site will be fully responsive and optimized for performance.

## Architecture

### Technology Stack
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v3+
- **Build Tool**: Vite (for fast development and optimized production builds)
- **Image Optimization**: Unsplash API for high-quality stock images
- **Icons**: Lucide React (modern, accessible icon library)

### Project Structure
```
wecarewellness-website/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Conditions.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── PathToWellness.tsx
│   │   ├── Insurance.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Components and Interfaces

### 1. Header Component
**Purpose**: Navigation bar with logo and menu links

**Props Interface**:
```typescript
interface HeaderProps {
  // No props needed - static navigation
}
```

**Features**:
- Sticky header that remains visible on scroll
- Responsive hamburger menu for mobile devices
- Smooth scroll navigation to page sections
- Logo/brand name on the left
- Navigation links: Home, About, Services, Conditions, Insurance, Contact

**Styling**:
- Background: White with subtle shadow
- Text: Dark gray/navy for contrast
- Mobile: Hamburger menu with slide-in drawer

### 2. Hero Component
**Purpose**: Eye-catching first impression with primary CTA

**Props Interface**:
```typescript
interface HeroProps {
  // No props needed - static content
}
```

**Features**:
- Full-width background image (professional, compassionate mental health imagery)
- Overlay gradient for text readability
- Prominent heading and tagline
- Primary CTA button ("Schedule Your Appointment")
- Phone number with click-to-call functionality

**Styling**:
- Height: 90vh on desktop, 70vh on mobile
- Background: Professional stock image with dark overlay (opacity 0.5)
- Text: White for contrast
- CTA Button: Teal/green accent color (#10b981 or similar calming color)

### 3. Services Component
**Purpose**: Display all mental health services offered

**Props Interface**:
```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ServicesProps {
  services: Service[];
}
```

**Features**:
- Grid layout of service cards (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each card includes icon, title, and description
- Hover effects for interactivity
- "Explore All Services" CTA at bottom

**Styling**:
- Cards: White background with subtle shadow and border
- Icons: Teal/green accent color
- Spacing: Generous padding for readability

### 4. Conditions Component
**Purpose**: List mental health conditions treated

**Props Interface**:
```typescript
interface ConditionsProps {
  conditions: string[];
}
```

**Features**:
- Multi-column grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
- Each condition as a pill/badge with checkmark icon
- "Find Support for Your Condition" CTA

**Styling**:
- Background: Light gray/blue (#f8fafc)
- Pills: White with subtle border and checkmark icon
- Text: Dark gray for readability

### 5. WhyChooseUs Component
**Purpose**: Highlight differentiators and build trust

**Props Interface**:
```typescript
interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface WhyChooseUsProps {
  differentiators: Differentiator[];
}
```

**Features**:
- 2x2 grid of differentiator cards on desktop
- Each card with icon, title, and description
- Testimonial quote in styled blockquote
- Professional imagery alongside content

**Styling**:
- Background: White
- Cards: Light background with accent border on left
- Quote: Italic text with decorative quotation marks

### 6. PathToWellness Component
**Purpose**: Explain the care process in 3 steps

**Props Interface**:
```typescript
interface Step {
  number: number;
  title: string;
  description: string;
}

interface PathToWellnessProps {
  steps: Step[];
}
```

**Features**:
- Horizontal timeline on desktop, vertical on mobile
- Numbered steps with connecting line
- "Start Your Journey Today" CTA

**Styling**:
- Background: Light teal/green gradient
- Step numbers: Circular badges with accent color
- Connecting line: Dashed or solid accent color

### 7. Insurance Component
**Purpose**: Communicate payment options

**Props Interface**:
```typescript
interface InsuranceProps {
  // No props needed - static content
}
```

**Features**:
- Brief description of insurance acceptance
- Self-pay option mention
- "Check Accepted Insurance" CTA link

**Styling**:
- Background: White
- Simple, clean layout with icon
- CTA: Accent color link

### 8. Contact Component
**Purpose**: Provide contact information and location

**Props Interface**:
```typescript
interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

interface ContactProps {
  contactInfo: ContactInfo;
}
```

**Features**:
- Address, phone, and email with appropriate icons
- Clickable phone (tel:) and email (mailto:) links
- Optional: Embedded map or map link

**Styling**:
- Background: Light gray
- Icons: Accent color
- Layout: Centered with generous spacing

### 9. Footer Component
**Purpose**: Secondary navigation and legal links

**Props Interface**:
```typescript
interface FooterProps {
  // No props needed - static content
}
```

**Features**:
- Navigation links (repeated from header)
- Legal links: Privacy Policy, HIPAA Notice, Terms & Conditions
- Copyright notice
- Social media links (if applicable)

**Styling**:
- Background: Dark gray/navy
- Text: Light gray/white
- Links: Hover effect with accent color

## Data Models

### Service Model
```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}
```

### Differentiator Model
```typescript
interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}
```

### Step Model
```typescript
interface Step {
  number: number;
  title: string;
  description: string;
}
```

### Contact Info Model
```typescript
interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}
```

## Design System

### Color Palette
- **Primary (Accent)**: Teal/Green (#10b981) - represents growth, healing, wellness
- **Secondary**: Soft Blue (#3b82f6) - trust, calm
- **Neutral Dark**: Navy/Dark Gray (#1e293b) - text, headers
- **Neutral Light**: Light Gray (#f8fafc) - backgrounds, sections
- **White**: (#ffffff) - cards, primary background
- **Text**: Dark Gray (#334155) - body text

### Typography
- **Headings**: Inter or Poppins (sans-serif, modern, professional)
- **Body**: Inter or Open Sans (highly readable)
- **Font Sizes** (Tailwind classes):
  - H1: text-5xl md:text-6xl
  - H2: text-3xl md:text-4xl
  - H3: text-xl md:text-2xl
  - Body: text-base md:text-lg
  - Small: text-sm

### Spacing
- Section padding: py-16 md:py-24
- Container max-width: max-w-7xl
- Card padding: p-6 md:p-8
- Grid gaps: gap-6 md:gap-8

### Imagery Guidelines
- Use Unsplash for stock images with keywords: "mental health", "therapy", "wellness", "compassion", "diverse people"
- Ensure diverse representation
- Avoid overly clinical settings
- Prefer natural lighting and warm tones
- All images must have descriptive alt text

## Error Handling

### Image Loading
- Provide fallback background colors for hero section
- Use lazy loading for images below the fold
- Handle failed image loads gracefully with placeholder

### Navigation
- Smooth scroll with fallback for unsupported browsers
- Handle missing section IDs gracefully

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Testing Strategy

### Component Testing
- Verify all components render without errors
- Test responsive behavior at different breakpoints
- Validate accessibility (ARIA labels, keyboard navigation)

### Integration Testing
- Test smooth scroll navigation
- Verify all CTAs link correctly
- Test click-to-call and mailto links

### Accessibility Testing
- Ensure WCAG 2.2 AA compliance
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios

### Performance Testing
- Lighthouse score target: 90+ for all metrics
- Optimize images for web
- Minimize bundle size
- Test load times on 3G connection

## Implementation Notes

### Phase 1: Project Setup
- Initialize Vite + React + TypeScript project
- Install and configure Tailwind CSS
- Set up project structure and base components

### Phase 2: Component Development
- Build components in order: Header → Hero → Services → Conditions → WhyChooseUs → PathToWellness → Insurance → Contact → Footer
- Use placeholder content initially
- Implement responsive design from the start

### Phase 3: Content Integration
- Replace placeholder content with actual copy from requirements
- Integrate stock images from Unsplash
- Add icons from Lucide React

### Phase 4: Polish & Optimization
- Refine animations and transitions
- Optimize images and bundle size
- Test across devices and browsers
- Validate accessibility compliance
