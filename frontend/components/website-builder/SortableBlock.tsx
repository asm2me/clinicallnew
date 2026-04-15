'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { useState } from 'react';
import type { Block } from '@/types/website';

interface SortableBlockProps {
  block:      Block;
  isSelected: boolean;
  onSelect:   () => void;
  onUpdate:   (data: Record<string, unknown>) => void;
  onRemove:   () => void;
}

const BLOCK_LABELS: Record<string, string> = {
  hero: 'Hero Section', about: 'About Clinic', services: 'Services',
  doctors: 'Doctors', booking: 'Booking Widget', contact: 'Contact',
  testimonials: 'Testimonials', stats: 'Stats', faq: 'FAQ',
  text: 'Text Block', image: 'Image', divider: 'Divider',
};

export function SortableBlock({ block, isSelected, onSelect, onUpdate, onRemove }: SortableBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg overflow-hidden transition-shadow ${
        isSelected ? 'border-primary shadow-md' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Block Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 cursor-pointer"
        onClick={onSelect}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {BLOCK_LABELS[block.type] ?? block.type}
        </span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Block Settings (expanded) */}
      {expanded && (
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <BlockSettings block={block} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function BlockSettings({ block, onUpdate }: { block: Block; onUpdate: (data: Record<string, unknown>) => void }) {
  const handleChange = (key: string, value: unknown) => {
    onUpdate({ ...block.data, [key]: value });
  };

  return (
    <div className="space-y-3">
      {Object.entries(block.data).map(([key, value]) => {
        if (typeof value === 'boolean') {
          return (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</label>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange(key, e.target.checked)}
                className="rounded"
              />
            </div>
          );
        }
        if (typeof value === 'string' && value.length < 100) {
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          );
        }
        if (typeof value === 'string') {
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <textarea
                value={value}
                rows={3}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
