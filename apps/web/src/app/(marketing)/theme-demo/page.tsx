'use client';

import ThemeSwitcher from '@/components/theme-switcher';

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen">
      {/* Theme Switcher Bar */}
      <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container-wide py-4">
          <ThemeSwitcher />
        </div>
      </div>

      <main className="container-wide section-py">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-gradient">
            Theme Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the refreshed themes available. Switch between the luminous Aurora palette
            and the warm Ember palette to see the full visual transformation.
          </p>
        </section>

        {/* Color Palette */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Color Palette</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary Colors */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold mb-4">Primary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-500"></div>
                  <code className="text-sm">primary-500</code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-600"></div>
                  <code className="text-sm">primary-600</code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-700"></div>
                  <code className="text-sm">primary-700</code>
                </div>
              </div>
            </div>

            {/* Secondary Colors */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold mb-4">Secondary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary-500"></div>
                  <code className="text-sm">secondary-500</code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary-600"></div>
                  <code className="text-sm">secondary-600</code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary-700"></div>
                  <code className="text-sm">secondary-700</code>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold mb-4">Accent</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent-500"></div>
                  <code className="text-sm">accent-500</code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent-600"></div>
                  <code className="text-sm">accent-600</code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent-700"></div>
                  <code className="text-sm">accent-700</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Button Examples */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Button Styles</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-primary" disabled>Disabled Button</button>
          </div>
        </section>

        {/* Card Examples */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Card Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-base card-hover p-6">
              <div className="icon-wrap mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Track your metrics with beautiful visualizations.
              </p>
            </div>

            <div className="card-base card-hover p-6">
              <div className="icon-wrap mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Design</h3>
              <p className="text-muted-foreground">
                Create stunning designs with our tools.
              </p>
            </div>

            <div className="card-base card-hover p-6">
              <div className="icon-wrap mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance</h3>
              <p className="text-muted-foreground">
                Lightning fast performance for all users.
              </p>
            </div>
          </div>
        </section>

        {/* Badge Examples */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Badges & Tags</h2>
          <div className="flex flex-wrap gap-3">
            <span className="badge">Default Badge</span>
            <span className="badge">New Feature</span>
            <span className="badge">Updated</span>
            <span className="badge">Beta</span>
            <span className="badge">Premium</span>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">KPI Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="kpi-card">
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold">12,459</p>
              <p className="text-sm text-primary mt-2">+12.5%</p>
            </div>
            <div className="kpi-card">
              <p className="text-sm text-muted-foreground mb-1">Revenue</p>
              <p className="text-3xl font-bold">$84.2K</p>
              <p className="text-sm text-primary mt-2">+8.2%</p>
            </div>
            <div className="kpi-card">
              <p className="text-sm text-muted-foreground mb-1">Sessions</p>
              <p className="text-3xl font-bold">45.8K</p>
              <p className="text-sm text-primary mt-2">+23.1%</p>
            </div>
            <div className="kpi-card">
              <p className="text-sm text-muted-foreground mb-1">Conversion</p>
              <p className="text-3xl font-bold">3.24%</p>
              <p className="text-sm text-primary mt-2">+5.7%</p>
            </div>
          </div>
        </section>

        {/* Gradient Examples */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Gradients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hero-gradient rounded-2xl p-12 text-center text-white">
              <h3 className="text-2xl font-bold mb-2">Hero Gradient</h3>
              <p className="opacity-90">Perfect for hero sections</p>
            </div>
            <div className="surface-gradient rounded-2xl p-12 text-center border">
              <h3 className="text-2xl font-bold mb-2">Surface Gradient</h3>
              <p className="text-muted-foreground">Great for cards and sections</p>
            </div>
          </div>
        </section>

        {/* Glass Effect */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Glass Morphism</h2>
          <div className="hero-gradient rounded-2xl p-12">
            <div className="glass-card rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Glass Card Effect</h3>
              <p className="text-muted-foreground">
                This card uses a glass morphism effect with backdrop blur. 
                It creates a beautiful frosted glass appearance that works 
                perfectly with gradient backgrounds.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
