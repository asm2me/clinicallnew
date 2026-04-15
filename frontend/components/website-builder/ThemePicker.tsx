'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { websiteApi } from '@/lib/api';
import { toast } from '@/hooks/useToast';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Theme {
  id: string;
  name: string;
  preview: string;
  colors: { primary: string; secondary: string };
}

export function ThemePicker({ themes }: { themes: Theme[] }) {
  const qc = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['website-settings'],
    queryFn:  () => websiteApi.settings().then((r) => r.data),
  });

  const applyTheme = useMutation({
    mutationFn: (themeId: string) => websiteApi.updateSettings({ theme: themeId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['website-settings'] });
      toast({ title: 'Theme applied!', variant: 'success' });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Choose a Theme</h2>
        <p className="text-sm text-gray-500">Select a pre-built template for your clinic website</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => applyTheme.mutate(theme.id)}
            className={cn(
              'relative group rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg',
              settings?.theme === theme.id
                ? 'border-primary shadow-md shadow-primary/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            )}
          >
            {/* Theme preview */}
            <div
              className="h-32 w-full"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` }}
            >
              <div className="p-3 space-y-1.5">
                <div className="h-2 bg-white/30 rounded w-3/4" />
                <div className="h-1.5 bg-white/20 rounded w-1/2" />
                <div className="h-1.5 bg-white/20 rounded w-2/3" />
                <div className="mt-3 h-6 bg-white/40 rounded-full w-1/2" />
              </div>
            </div>

            <div className="p-2.5 bg-white dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{theme.name}</p>
            </div>

            {settings?.theme === theme.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
