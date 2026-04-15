'use client';

import { Globe, Eye, EyeOff, Plus, Home } from 'lucide-react';
import type { WebsitePage } from '@/types/website';

interface PageListProps {
  pages:        WebsitePage[];
  selectedPage: WebsitePage | null;
  onSelect:     (page: WebsitePage) => void;
  onPublish:    (slug: string) => void;
}

export function PageList({ pages, selectedPage, onSelect, onPublish }: PageListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Pages</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Page
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onSelect(page)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedPage?.id === page.id
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {page.is_homepage && <Home className="w-4 h-4 text-primary" />}
              <h3 className="font-medium text-gray-900 dark:text-white">{page.title}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> /{page.slug}
              </span>
              <span className="flex items-center gap-1">
                {page.is_published
                  ? <><Eye className="w-3 h-3 text-green-500" /> Published</>
                  : <><EyeOff className="w-3 h-3" /> Draft</>
                }
              </span>
              <span>{page.json_content?.length ?? 0} blocks</span>
            </div>
          </button>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-400">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No pages yet</p>
          <p className="text-sm mt-1">Create your first page to get started</p>
        </div>
      )}
    </div>
  );
}
