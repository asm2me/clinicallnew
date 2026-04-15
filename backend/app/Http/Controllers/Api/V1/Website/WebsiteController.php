<?php

namespace App\Http\Controllers\Api\V1\Website;

use App\Http\Controllers\Controller;
use App\Models\WebsitePage;
use App\Services\WebsiteBuilderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WebsiteController extends Controller
{
    public function __construct(private readonly WebsiteBuilderService $builderService) {}

    /** GET /v1/website/pages */
    public function index(): JsonResponse
    {
        $pages = WebsitePage::orderBy('order')->get();
        return response()->json(['pages' => $pages]);
    }

    /** GET /v1/website/pages/{slug} */
    public function show(string $slug): JsonResponse
    {
        $page = WebsitePage::where('slug', $slug)->firstOrFail();
        return response()->json(['page' => $page]);
    }

    /** POST /v1/website/pages */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title'            => 'required|string|max:255',
            'blocks'           => 'required|array',
            'meta_title'       => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'is_published'     => 'boolean',
        ]);

        $page = $this->builderService->savePage($request->all());
        return response()->json(['page' => $page], 201);
    }

    /** PUT /v1/website/pages/{slug} */
    public function update(Request $request, string $slug): JsonResponse
    {
        $request->validate([
            'title'  => 'sometimes|string|max:255',
            'blocks' => 'sometimes|array',
        ]);

        $page = WebsitePage::where('slug', $slug)->firstOrFail();
        $page = $this->builderService->savePage(array_merge(['slug' => $slug], $request->all()));

        return response()->json(['page' => $page]);
    }

    /** DELETE /v1/website/pages/{slug} */
    public function destroy(string $slug): JsonResponse
    {
        WebsitePage::where('slug', $slug)->firstOrFail()->delete();
        return response()->json(['message' => 'Page deleted.']);
    }

    /** GET /v1/website/block-types */
    public function blockTypes(): JsonResponse
    {
        return response()->json(['blocks' => $this->builderService->getBlockTypes()]);
    }

    /** GET /v1/website/themes */
    public function themes(): JsonResponse
    {
        return response()->json(['themes' => $this->builderService->getThemes()]);
    }

    /** GET /v1/website/sitemap.xml */
    public function sitemap(): Response
    {
        $baseUrl = request()->getSchemeAndHttpHost();
        $xml     = $this->builderService->generateSitemap($baseUrl);

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /** GET /v1/website/widget-script */
    public function widgetScript(): JsonResponse
    {
        $script = $this->builderService->getBookingWidgetScript(tenant('id'));
        return response()->json(['script' => $script]);
    }

    /** GET /v1/website/settings */
    public function settings(): JsonResponse
    {
        $tenant = tenant();
        return response()->json([
            'theme'      => $tenant->theme,
            'custom_css' => $tenant->custom_css,
            'settings'   => $tenant->settings,
        ]);
    }

    /** PUT /v1/website/settings */
    public function updateSettings(Request $request): JsonResponse
    {
        $request->validate([
            'theme'      => 'nullable|string',
            'custom_css' => 'nullable|string',
        ]);

        $tenant = tenant();
        $tenant->update($request->only(['theme', 'custom_css']));

        return response()->json(['message' => 'Website settings updated.']);
    }
}
