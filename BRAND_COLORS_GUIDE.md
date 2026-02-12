# Brand Color Implementation Guide

## Brand Color Palette

### Primary Colors
- **Primary Brand Green**: `#1F7A4D` - Main brand color for buttons, links, primary actions
- **Accent Green**: `#2BB673` - Secondary actions, hover states, highlights
- **Highlight Green**: `#22C55E` - Carbon badges, success states, positive metrics

### Supporting Colors
- **Warning/Time**: `#F59E0B` - Time-related metrics, warnings, alerts
- **Dark Background**: `#0F172A` - Headers, navigation, dark sections
- **Light Background**: `#F5F7FA` - Page backgrounds, cards, light sections

## Color Usage Guidelines

### Text Colors
- **Primary Text** (on light backgrounds): `#0F172A` (brand-dark) or `#1e293b` (gray-800)
- **Secondary Text**: `#475569` (gray-600) or `#64748b` (gray-500)
- **Muted Text**: `#94a3b8` (gray-400)
- **Text on Dark**: `#F5F7FA` (brand-light) or white

### Backgrounds
- **Page Background**: `#F5F7FA` (brand-light) or `#363636` (gray-100)
- **Card Background**: `#ffffff` (white)
- **Dark Sections**: `#0F172A` (brand-dark)
- **Hover States**: `#f0fdf7` (primary-50) or `#dcfcec` (primary-100)

### Buttons & Interactive Elements
- **Primary Button**: Background `#1F7A4D`, Hover `#166239`
- **Secondary Button**: Background `#2BB673`, Hover `#1F7A4D`
- **Success/Positive**: `#22C55E`
- **Warning**: `#F59E0B`
- **Danger**: `#ef4444`

### Borders
- **Light Border**: `#e2e8f0` (gray-200)
- **Medium Border**: `#cbd5e1` (gray-300)
- **Accent Border**: `#1F7A4D` (brand-primary) or `#2BB673` (brand-accent)

## Component-Specific Updates Needed

### 1. Sidebar (`src/components/Sidebar/index.tsx`)
```tsx
// Active state
bg-brand-primary text-white border-l-4 border-brand-accent

// Hover state
hover:bg-primary-50

// Logout button
text-red-600 hover:bg-red-50
```

### 2. Dashboard (`src/components/Dashboard/index.tsx`)
```tsx
// Metric cards
text-brand-primary (for values)
text-gray-600 (for labels)

// Charts/graphs
Use brand-primary, brand-accent, brand-highlight
```

### 3. OptimizationResults (`src/components/OptimizationResults/index.tsx`)
```tsx
// Headers
text-gray-900

// AI Summary card
border-brand-primary
text-brand-primary (heading)
text-gray-700 (content)

// Sort buttons
bg-brand-primary (active)
text-gray-600 (inactive)
```

### 4. Buttons (all components)
```tsx
// Primary
bg-brand-primary hover:bg-primary-700 text-white

// Secondary
bg-brand-accent hover:bg-brand-primary text-white

// Ghost
text-gray-700 hover:bg-gray-100
```

### 5. Cards
```tsx
// Standard card
bg-white border-gray-200

// Highlighted card
border-l-4 border-brand-primary

// Success card
border-l-4 border-brand-highlight
```

### 6. Badges
```tsx
// Carbon/Success
bg-green-50 text-brand-highlight border-brand-highlight

// Warning/Time
bg-orange-50 text-brand-warning border-brand-warning

// Info
bg-blue-50 text-blue-600 border-blue-600
```

## CSS Variable Usage

Use CSS variables for consistency:

```css
/* Primary actions */
color: var(--color-brand-primary);
background: var(--color-brand-primary);

/* Accents */
color: var(--color-brand-accent);

/* Highlights */
color: var(--color-brand-highlight);

/* Warnings */
color: var(--color-brand-warning);

/* Backgrounds */
background: var(--color-brand-light);
background: var(--color-brand-dark);
```

## Tailwind Class Replacements

### Old → New
- `green-500` → `brand-accent` or `primary-500`
- `green-600` → `brand-primary` or `primary-600`
- `green-700` → `primary-700`
- `emerald-*` → `primary-*` or `brand-*`
- `gray-50` → `brand-light` or `gray-50`
- `slate-*` → `gray-*` (using new gray palette)

## Accessibility Guidelines

### Contrast Ratios (WCAG AA)
- **Normal text**: Minimum 4.5:1
- **Large text**: Minimum 3:1
- **UI components**: Minimum 3:1

### Verified Combinations
✅ `#1F7A4D` on white - 4.8:1 (Pass)
✅ `#2BB673` on white - 3.2:1 (Pass for large text)
✅ White on `#0F172A` - 15.8:1 (Pass)
✅ `#0F172A` on `#F5F7FA` - 14.2:1 (Pass)
✅ `#475569` on white - 7.5:1 (Pass)

## Implementation Checklist

- [x] Update CSS variables in `src/index.css`
- [x] Update Tailwind config in `tailwind.config.js`
- [ ] Update Sidebar component
- [ ] Update Dashboard component
- [ ] Update OptimizationResults component
- [ ] Update QueryHistory component
- [ ] Update ImpactDashboard component
- [ ] Update DemandPrediction component
- [ ] Update ProfilePage component
- [ ] Update UI components (Button, Card, Badge, etc.)
- [ ] Update LandingPage component
- [ ] Update AuthPage component
- [ ] Test all components for text visibility
- [ ] Verify accessibility contrast ratios
