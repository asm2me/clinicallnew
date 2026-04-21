# Theme Guide

This project now supports multiple beautiful themes that you can switch between dynamically.

## Available Themes

### 🌊 Lagoon Theme
- **Primary Color:** Teal (`#0f766e`)
- **Secondary Color:** Sky (`#0ea5e9`)
- **Accent Color:** Gold (`#eab308`)
- Perfect for healthcare dashboards, calm interfaces, and trustworthy product experiences

### 🌇 Sunset Theme
- **Primary Color:** Rose (`#be185d`)
- **Secondary Color:** Orange (`#f97316`)
- **Accent Color:** Blue (`#3b82f6`)
- Perfect for high-energy marketing pages, bold campaigns, and warmer visual storytelling

## How to Use Themes

### Method 1: Theme Switcher Component
Use the `ThemeSwitcher` component in your pages:

```tsx
import ThemeSwitcher from '@/components/theme-switcher';

export default function MyPage() {
  return (
    <div>
      <ThemeSwitcher />
      {/* Your page content */}
    </div>
  );
}
```

### Method 2: Manual Theme Switching
Add the theme class to your HTML element:

```tsx
// Switch to Sunset theme
document.documentElement.classList.add('ocean');
document.documentElement.classList.remove('default');

// Switch to Lagoon theme
document.documentElement.classList.add('default');
document.documentElement.classList.remove('ocean');

// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

### Method 3: Using Tailwind Classes
Use the theme-specific color classes:

```tsx
// Sunset theme colors
<div className="bg-primary_ocean-500 text-white">
  This uses the Sunset primary color
</div>

// Lagoon theme colors
<div className="bg-primary-500 text-white">
  This uses the Lagoon primary color
</div>
```

## Theme Color Palettes

### Lagoon Theme Colors
- **Primary 500:** `#14b8a6` (Teal)
- **Secondary 500:** `#0ea5e9` (Sky)
- **Accent 500:** `#eab308` (Gold)

### Sunset Theme Colors
- **Primary 500:** `#f43f5e` (Rose)
- **Secondary 500:** `#f97316` (Orange)
- **Accent 500:** `#3b82f6` (Blue)

## CSS Variables

Each theme uses CSS variables for consistent styling:

```css
/* Theme-specific variables */
--background
--foreground
--card
--card-foreground
--border
--muted
--muted-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--accent
--accent-foreground
--success
--warning
--danger
--ring
--gradient-hero
--gradient-surface
--gradient-soft
--shadow-soft
--shadow-medium
--shadow-strong
--button-shadow
--button-shadow-hover
```

## Component Classes

### Buttons
```tsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
```

### Cards
```tsx
<div className="card-base">
  Content
</div>

<div className="card-base card-hover">
  Hoverable Card
</div>
```

### Badges
```tsx
<span className="badge">Badge Text</span>
```

### KPI Cards
```tsx
<div className="kpi-card">
  <p className="text-3xl font-bold">12,459</p>
  <p className="text-sm text-muted-foreground">Total Users</p>
</div>
```

### Gradients
```tsx
<div className="hero-gradient">
  Hero section with gradient background
</div>

<div className="surface-gradient">
  Surface with subtle gradient
</div>
```

### Glass Effect
```tsx
<div className="glass-card">
  Glass morphism effect
</div>
```

### Text Gradient
```tsx
<h1 className="text-gradient">
  Gradient Text Heading
</h1>
```

## Dark Mode

Both themes support dark mode. Combine the `dark` class with any theme:

```tsx
// Light Sunset
document.documentElement.classList.add('ocean');

// Dark Sunset
document.documentElement.classList.add('ocean', 'dark');

// Light Lagoon
document.documentElement.classList.remove('ocean');

// Dark Lagoon
document.documentElement.classList.remove('ocean');
document.documentElement.classList.add('dark');
```

## Demo Page

Visit `/theme-demo` to see a comprehensive showcase of all theme features including:
- Color palettes
- Button styles
- Card designs
- Badges and tags
- KPI cards
- Gradients
- Glass morphism effects

## Theme Switcher Features

The `ThemeSwitcher` component provides:
- One-click theme switching between Lagoon and Sunset themes
- Dark mode toggle
- Local storage persistence (remembers your choice)
- Visual feedback on active theme

## Customizing Themes

To customize or add new themes:

1. **Add colors to `tailwind.config.js`:**
```js
primary_custom: {
  50: '#your-color',
  // ... rest of the palette
}
```

2. **Add CSS variables to `globals.css`:**
```css
.custom {
  --primary: 199 89% 48%;
  // ... other variables
}

.dark.custom {
  --primary: 199 89% 45%;
  // ... dark mode variables
}
```

3. **Update ThemeSwitcher component:**
```tsx
const [theme, setTheme] = useState<Theme>('default' | 'ocean' | 'custom');
/* 'default' maps to Lagoon and 'ocean' maps to Sunset */
```

## Best Practices

1. **Use CSS Variables:** Always use CSS variables for theme colors to ensure consistency
2. **Test Both Themes:** Make sure your components look good in both themes
3. **Test Dark Mode:** Always test both light and dark modes
4. **Maintain Contrast:** Ensure sufficient contrast ratios for accessibility
5. **Use Semantic Colors:** Use success/warning/danger variables for appropriate states

## Browser Support

The themes use modern CSS features:
- CSS Custom Properties (Variables)
- CSS Gradients
- Backdrop Filter (Glass morphism)
- Transitions and Animations

These features are supported in all modern browsers.

## Accessibility

All themes are designed to preserve strong contrast across interface surfaces:
- Normal text: target 4.5:1 contrast ratio
- Large text: target 3:1 contrast ratio
- UI components: target 3:1 contrast ratio

## Questions?

For questions or issues with theming, please refer to the project documentation or contact the development team.
