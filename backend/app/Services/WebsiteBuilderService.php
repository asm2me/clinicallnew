<?php

namespace App\Services;

use App\Models\WebsitePage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class WebsiteBuilderService
{
    /**
     * Available block types for the page builder.
     */
    public function getBlockTypes(): array
    {
        return [
            ['type' => 'hero',       'label' => 'Hero Section',       'icon' => 'hero',       'category' => 'sections'],
            ['type' => 'about',      'label' => 'About Clinic',        'icon' => 'info',       'category' => 'sections'],
            ['type' => 'services',   'label' => 'Services Grid',       'icon' => 'grid',       'category' => 'sections'],
            ['type' => 'doctors',    'label' => 'Doctors List',        'icon' => 'users',      'category' => 'sections'],
            ['type' => 'booking',    'label' => 'Booking Widget',      'icon' => 'calendar',   'category' => 'widgets'],
            ['type' => 'contact',    'label' => 'Contact Form',        'icon' => 'mail',       'category' => 'sections'],
            ['type' => 'gallery',    'label' => 'Photo Gallery',       'icon' => 'image',      'category' => 'media'],
            ['type' => 'testimonials','label'=> 'Testimonials',        'icon' => 'quote',      'category' => 'social'],
            ['type' => 'stats',      'label' => 'Stats Counter',       'icon' => 'bar-chart',  'category' => 'widgets'],
            ['type' => 'faq',        'label' => 'FAQ Section',         'icon' => 'help',       'category' => 'sections'],
            ['type' => 'cta',        'label' => 'Call to Action',      'icon' => 'zap',        'category' => 'sections'],
            ['type' => 'map',        'label' => 'Location Map',        'icon' => 'map-pin',    'category' => 'media'],
            ['type' => 'text',       'label' => 'Text Block',          'icon' => 'type',       'category' => 'basic'],
            ['type' => 'image',      'label' => 'Image Block',         'icon' => 'image',      'category' => 'basic'],
            ['type' => 'divider',    'label' => 'Divider',             'icon' => 'minus',      'category' => 'basic'],
        ];
    }

    /**
     * Get available themes.
     */
    public function getThemes(): array
    {
        return [
            ['id' => 'clinic',       'name' => 'Modern Clinic',   'preview' => '/themes/clinic.png',       'colors' => ['primary' => '#2563eb', 'secondary' => '#10b981']],
            ['id' => 'dental',       'name' => 'Dental Care',     'preview' => '/themes/dental.png',       'colors' => ['primary' => '#06b6d4', 'secondary' => '#0891b2']],
            ['id' => 'dermatology',  'name' => 'Dermatology',     'preview' => '/themes/dermatology.png',  'colors' => ['primary' => '#ec4899', 'secondary' => '#db2777']],
            ['id' => 'hospital',     'name' => 'Hospital',        'preview' => '/themes/hospital.png',     'colors' => ['primary' => '#1e40af', 'secondary' => '#1d4ed8']],
            ['id' => 'wellness',     'name' => 'Wellness Center', 'preview' => '/themes/wellness.png',     'colors' => ['primary' => '#16a34a', 'secondary' => '#15803d']],
        ];
    }

    /**
     * Save a page with its block content.
     */
    public function savePage(array $data): WebsitePage
    {
        $page = WebsitePage::updateOrCreate(
            ['slug' => $data['slug'] ?? Str::slug($data['title'])],
            [
                'title'            => $data['title'],
                'json_content'     => $data['blocks'],
                'meta_title'       => $data['meta_title']       ?? $data['title'],
                'meta_description' => $data['meta_description'] ?? '',
                'is_published'     => $data['is_published']     ?? false,
                'is_homepage'      => $data['is_homepage']      ?? false,
                'page_type'        => $data['page_type']        ?? 'custom',
            ]
        );

        // Invalidate page cache
        Cache::forget("page:{$page->slug}");

        if ($page->is_homepage) {
            WebsitePage::where('id', '!=', $page->id)->update(['is_homepage' => false]);
        }

        return $page;
    }

    /**
     * Get a published page with cache.
     */
    public function getPublishedPage(string $slug): ?WebsitePage
    {
        return Cache::remember("page:{$slug}", 3600, fn() =>
            WebsitePage::where('slug', $slug)->where('is_published', true)->first()
        );
    }

    /**
     * Generate XML sitemap for the tenant's website.
     */
    public function generateSitemap(string $baseUrl): string
    {
        $pages = WebsitePage::published()->get();
        $xml   = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml  .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($pages as $page) {
            $url   = $page->is_homepage ? $baseUrl : "{$baseUrl}/{$page->slug}";
            $xml  .= "  <url>\n";
            $xml  .= "    <loc>{$url}</loc>\n";
            $xml  .= "    <lastmod>{$page->updated_at->toAtomString()}</lastmod>\n";
            $xml  .= "    <changefreq>weekly</changefreq>\n";
            $xml  .= "    <priority>" . ($page->is_homepage ? '1.0' : '0.8') . "</priority>\n";
            $xml  .= "  </url>\n";
        }

        $xml .= '</urlset>';
        return $xml;
    }

    /**
     * Generate the embeddable booking widget script tag.
     */
    public function getBookingWidgetScript(string $tenantId): string
    {
        $platformUrl = config('app.url');
        return <<<JS
<!-- Clinic Booking Widget -->
<div id="clinic-booking-widget"></div>
<script>
  (function(w,d,s,o,f,js,fjs){
    w['ClinicWidget']=o; w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s); fjs=d.getElementsByTagName(s)[0];
    js.id=o; js.src=f; js.async=1; fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','cw','{$platformUrl}/widget.js'));
  cw('init', { tenantId: '{$tenantId}', container: '#clinic-booking-widget' });
</script>
<!-- End Clinic Booking Widget -->
JS;
    }
}
