<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class WebsitePage extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'json_content',    // Drag & drop blocks as JSON
        'meta_title',
        'meta_description',
        'og_image',
        'is_published',
        'is_homepage',
        'page_type',       // custom | services | doctors | contact | booking
        'order',
        'published_at',
    ];

    protected $casts = [
        'json_content' => 'array',
        'is_published' => 'boolean',
        'is_homepage'  => 'boolean',
        'published_at' => 'datetime',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Render page blocks to HTML.
     * Each block has: type, data, settings
     */
    public function renderBlocks(): string
    {
        $html = '';
        foreach ($this->json_content ?? [] as $block) {
            $html .= view("website.blocks.{$block['type']}", ['data' => $block['data']])->render();
        }
        return $html;
    }
}
