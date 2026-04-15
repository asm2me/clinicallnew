'use client';

import { useState, useCallback } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { SortableBlock } from './SortableBlock';
import { BlockTypePanel } from './BlockTypePanel';
import { Save, Plus } from 'lucide-react';
import type { Block, BlockType } from '@/types/website';

interface BlockEditorProps {
  blocks:     Block[];
  blockTypes: BlockType[];
  onSave:     (blocks: Block[]) => void;
  isSaving:   boolean;
}

export function BlockEditor({ blocks: initialBlocks, blockTypes, onSave, isSaving }: BlockEditorProps) {
  const [blocks, setBlocks]     = useState<Block[]>(initialBlocks);
  const [selected, setSelected] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((prev) => {
        const oldIdx = prev.findIndex((b) => b.id === active.id);
        const newIdx = prev.findIndex((b) => b.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }, []);

  const addBlock = useCallback((type: string) => {
    const newBlock: Block = {
      id:   `block-${Date.now()}`,
      type,
      data: getDefaultBlockData(type),
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelected(newBlock.id);
  }, []);

  const updateBlock = useCallback((id: string, data: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelected(null);
  }, []);

  return (
    <div className="flex flex-1 gap-4 h-full overflow-hidden">
      {/* Block type panel */}
      <BlockTypePanel blockTypes={blockTypes} onAdd={addBlock} />

      {/* Canvas */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {blocks.length} block{blocks.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => onSave(blocks)}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {blocks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed rounded-xl">
              <Plus className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">Add blocks from the left panel</p>
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  isSelected={selected === block.id}
                  onSelect={() => setSelected(block.id)}
                  onUpdate={(data) => updateBlock(block.id, data)}
                  onRemove={() => removeBlock(block.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

function getDefaultBlockData(type: string): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    hero:        { title: 'Welcome to Our Clinic', subtitle: 'Quality healthcare for your family', cta: 'Book Appointment', image: '' },
    about:       { title: 'About Us', text: 'We provide comprehensive medical services...', image: '' },
    services:    { title: 'Our Services', show_all: true, items: [] },
    doctors:     { title: 'Our Doctors', show_all: true, items: [] },
    booking:     { title: 'Book an Appointment', subtitle: 'Choose your preferred doctor and time' },
    contact:     { title: 'Contact Us', show_form: true, show_map: true, email: '', phone: '', address: '' },
    testimonials:{ title: 'What Patients Say', items: [] },
    stats:       { items: [{ value: '5000+', label: 'Patients' }, { value: '20+', label: 'Doctors' }, { value: '10+', label: 'Years' }] },
    faq:         { title: 'Frequently Asked Questions', items: [] },
    text:        { content: 'Enter your text here...' },
    image:       { src: '', alt: '', caption: '' },
    divider:     { style: 'solid' },
  };
  return defaults[type] ?? {};
}
