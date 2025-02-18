'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TimezonePicker from './TimezonePicker';
import type { Event } from '@/data/events';

interface EventCardProps {
  event: Event;
  isSelected: boolean;
  onClick: () => void;
  onEdit?: (updatedEvent: Event) => void;
  onDelete?: (id: number) => void;
}

interface Event {
  id: number;
  title: string;
  date: string;
  description?: string;
  color?: string;
  timezone?: string;
}

export default function EventCard({ event, isSelected, onClick, onEdit, onDelete }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event>({
    ...event,
    timezone: event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const gradientClass = event.color || 'from-blue-500 to-purple-600 bg-gradient-to-br';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(editedEvent);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(event.id);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedEvent(event);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        className="p-4 sm:p-6 rounded-xl bg-white/10 backdrop-blur-lg"
        layout
      >
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={editedEvent.title}
            onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
            className="w-full bg-white/5 rounded-md px-3 py-2 text-white"
            placeholder="Event Title"
          />
          <input
            type="datetime-local"
            value={(() => {
              const date = new Date(editedEvent.date);
              // Format date to YYYY-MM-DDTHH:mm without timezone conversion
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              return `${year}-${month}-${day}T${hours}:${minutes}`;
            })()}
            onChange={(e) => {
              // Create date object from local time without timezone conversion
              const [datePart, timePart] = e.target.value.split('T');
              const [year, month, day] = datePart.split('-').map(Number);
              const [hours, minutes] = timePart.split(':').map(Number);
              
              const newDate = new Date();
              newDate.setFullYear(year);
              newDate.setMonth(month - 1);
              newDate.setDate(day);
              newDate.setHours(hours);
              newDate.setMinutes(minutes);
              newDate.setSeconds(0);
              newDate.setMilliseconds(0);
              
              setEditedEvent({ 
                ...editedEvent, 
                date: newDate.toISOString()
              });
            }}
            className="w-full bg-white/5 rounded-md px-3 py-2 text-white"
          />
          <TimezonePicker
            value={editedEvent.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
            onChange={(timezone) => setEditedEvent({ ...editedEvent, timezone })}
          />
          <input
            type="text"
            value={editedEvent.description || ''}
            onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
            className="w-full bg-white/5 rounded-md px-3 py-2 text-white"
            placeholder="Description (optional)"
          />
          <select
            value={editedEvent.color || 'from-blue-500 to-purple-600 bg-gradient-to-br'}
            onChange={(e) => setEditedEvent({ ...editedEvent, color: e.target.value })}
            className="w-full bg-white/5 rounded-md px-3 py-2 text-white"
          >
            <option value="from-blue-500 to-purple-600 bg-gradient-to-br">Blue Purple</option>
            <option value="from-green-500 to-emerald-600 bg-gradient-to-br">Green Emerald</option>
            <option value="from-red-500 to-pink-600 bg-gradient-to-br">Red Pink</option>
            <option value="from-yellow-500 to-orange-600 bg-gradient-to-br">Yellow Orange</option>
            <option value="from-indigo-500 to-violet-600 bg-gradient-to-br">Indigo Violet</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer p-4 sm:p-6 rounded-xl transition-all duration-300 ${
        isSelected 
          ? `${gradientClass} shadow-lg` 
          : 'bg-white/5 hover:bg-white/10'
      } backdrop-blur-lg relative group`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <motion.h3 
        className={`text-lg sm:text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-white/90'}`}
        layout
      >
        {event.title}
      </motion.h3>
      <motion.p 
        className={`text-sm sm:text-base ${isSelected ? 'text-white/80' : 'text-gray-400'}`}
        layout
      >
        {new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </motion.p>
      {event.description && (
        <motion.p 
          className={`mt-2 text-sm ${isSelected ? 'text-white/70' : 'text-gray-500'}`}
          layout
        >
          {event.description}
        </motion.p>
      )}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white mr-2"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
}
