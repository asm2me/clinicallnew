'use client';

import { Plus, Layout, Image, Type, Calendar, Users, MessageSquare, BarChart2, HelpCircle, Zap, MapPin, Minus } from 'lucide-react';
import type { BlockType } from '@/types/website';

const ICONS: Record<string, typeof Layout> = {
  hero: Layout, info: Layout, grid: Layout, users: Users,
  calendar: Calendar, mail: MessageSquare, image: Image,
  quote: MessageSquare, 'bar-chart': BarChart2, help: HelpCircle,
  zap: Zap, 'map-pin': MapPin, type: Type, minus: Minus,
};

interface BlockTypePanelProps {
  blockTypes: BlockType[];
  onAdd:      (type: string) => void;
}

export function BlockTypePanel({ blockTypes, onAdd }: BlockTypePanelProps) {
  const categories = [...new Set(blockTypes.map((b) => b.category))];

  return (
    <div className="w-56 bg-white dark:bg-gray-900 rounded-xl border overflow-y-auto flex-shrink-0">
      <div className="p-3 border-b">
        <h3 className="text-xs font-semibold text-gray-500 uppercase">Add Blocks</h3>
      </div>
      <div className="p-2 space-y-3">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1.5">{cat}</p>
            <div className="space-y-0.5">
              {blockTypes.filter((b) => b.category === cat).map((block) => {
                const Icon = ICONS[block.icon] ?? Layout;
                return (
                  <button
                    key={block.type}
                    onClick={() => onAdd(block.type)}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{block.label}</span>
                    <Plus className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
