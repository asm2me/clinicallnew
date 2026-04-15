'use client';

import type { WebsitePage } from '@/types/website';

export function WebsitePreview({ page }: { page: WebsitePage }) {
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 border rounded-xl overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2 px-3 py-1 bg-white dark:bg-gray-700 rounded text-xs text-gray-500 truncate">
          https://yourclinic.com/{page.slug}
        </div>
      </div>

      {/* Page preview */}
      <div className="p-6 overflow-y-auto max-h-[calc(100vh-16rem)] space-y-4">
        {(page.json_content ?? []).map((block, idx) => (
          <div key={idx} className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <span className="text-xs font-mono text-gray-400 uppercase">{block.type}</span>
            {block.data.title && (
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{block.data.title as string}</h2>
            )}
            {block.data.subtitle && (
              <p className="text-sm text-gray-500 mt-1">{block.data.subtitle as string}</p>
            )}
            {block.data.text && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{block.data.text as string}</p>
            )}
          </div>
        ))}
        {(page.json_content ?? []).length === 0 && (
          <p className="text-center text-gray-400 py-12">No blocks to preview</p>
        )}
      </div>
    </div>
  );
}
