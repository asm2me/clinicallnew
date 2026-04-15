'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { websiteApi } from '@/lib/api';
import { PageList } from '@/components/website-builder/PageList';
import { BlockEditor } from '@/components/website-builder/BlockEditor';
import { ThemePicker } from '@/components/website-builder/ThemePicker';
import { WebsitePreview } from '@/components/website-builder/WebsitePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Globe, Palette, Layout, Code2 } from 'lucide-react';
import { toast } from '@/hooks/useToast';
import type { WebsitePage, Block } from '@/types/website';

export default function WebsiteBuilderPage() {
  const qc          = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<WebsitePage | null>(null);
  const [previewMode, setPreviewMode]   = useState(false);

  const { data: pages = [] } = useQuery({
    queryKey: ['website-pages'],
    queryFn:  () => websiteApi.pages().then((r) => r.data.pages as WebsitePage[]),
  });

  const { data: blockTypes = [] } = useQuery({
    queryKey: ['block-types'],
    queryFn:  () => websiteApi.blockTypes().then((r) => r.data.blocks),
  });

  const { data: themes = [] } = useQuery({
    queryKey: ['website-themes'],
    queryFn:  () => websiteApi.themes().then((r) => r.data.themes),
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<WebsitePage>) =>
      selectedPage?.slug
        ? websiteApi.updatePage(selectedPage.slug, data)
        : websiteApi.savePage(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['website-pages'] });
      toast({ title: 'Page saved successfully!', variant: 'success' });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (slug: string) =>
      websiteApi.updatePage(slug, { is_published: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['website-pages'] });
      toast({ title: 'Page published!', variant: 'success' });
    },
  });

  const handleSaveBlocks = (blocks: Block[]) => {
    if (!selectedPage) return;
    saveMutation.mutate({ ...selectedPage, blocks });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Website Builder
          </h1>
          <p className="text-sm text-gray-500">Drag & drop your clinic website</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          {selectedPage && (
            <button
              onClick={() => publishMutation.mutate(selectedPage.slug)}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      <Tabs defaultValue="pages" className="flex-1 flex flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="pages"   className="gap-2"><Layout className="w-4 h-4" />Pages</TabsTrigger>
          <TabsTrigger value="builder" className="gap-2"><Code2 className="w-4 h-4" />Builder</TabsTrigger>
          <TabsTrigger value="theme"   className="gap-2"><Palette className="w-4 h-4" />Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="flex-1 mt-4">
          <PageList
            pages={pages}
            selectedPage={selectedPage}
            onSelect={setSelectedPage}
            onPublish={(slug) => publishMutation.mutate(slug)}
          />
        </TabsContent>

        <TabsContent value="builder" className="flex-1 mt-4 overflow-hidden">
          {selectedPage ? (
            <div className="flex gap-4 h-full">
              <BlockEditor
                blocks={selectedPage.json_content ?? []}
                blockTypes={blockTypes}
                onSave={handleSaveBlocks}
                isSaving={saveMutation.isPending}
              />
              {previewMode && (
                <WebsitePreview page={selectedPage} />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-xl text-gray-400">
              <div className="text-center">
                <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Select a page to start editing</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="theme" className="flex-1 mt-4">
          <ThemePicker themes={themes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
