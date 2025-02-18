'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from '@/components/Timer';
import EventCard from '@/components/EventCard';
import { events as defaultEvents, Event } from '@/data/events';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [background, setBackground] = useState({
    type: 'gradient',
    gradient: 'from-gray-900 to-gray-800',
    image: '',
    video: '',
    opacity: 0.9
  });

  const backgroundStyles = {
    gradient: `bg-gradient-to-br ${background.gradient}`,
    image: background.image ? `bg-cover bg-center bg-no-repeat` : '',
    video: background.video ? 'relative' : '',
  };

  const addNewEvent = () => {
    const newEvent: Event = {
      id: events.length + 1,
      title: "New Event",
      date: new Date().toISOString(),
      description: "Add your description",
      color: "from-blue-500 to-purple-600 bg-gradient-to-br",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    setEvents([...events, newEvent]);
    setSelectedEvent(newEvent);
  };

  const handleEditEvent = (updatedEvent: Event) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent);
  };

  const handleDeleteEvent = (id: number) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    if (selectedEvent?.id === id) {
      setSelectedEvent(updatedEvents[0] || null);
    }
  };

  return (
    <div className={`min-h-screen text-white ${backgroundStyles[background.type as keyof typeof backgroundStyles]}`}
      style={background.image ? { backgroundImage: `url(${background.image})` } : undefined}>
      {background.video && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
          style={{ opacity: background.opacity }}
        >
          <source src={background.video} type="video/mp4" />
        </video>
      )}
      {(background.type === 'image' || background.type === 'video') && (
        <div 
          className="absolute inset-0 bg-black -z-5"
          style={{ opacity: 1 - background.opacity }}
        />
      )}

      <div className="flex">
        {/* Left Side Panel */}
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: isPanelOpen ? 0 : -280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-[280px] h-screen bg-gray-900/95 backdrop-blur-sm shadow-xl border-r border-gray-800 flex flex-col fixed left-0 top-0 z-50"
        >
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-bold">Background Settings</h3>
            <button 
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isPanelOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
                />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-20">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Background Type</label>
                <select
                  value={background.type}
                  onChange={(e) => setBackground(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                >
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              {background.type === 'gradient' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Gradient</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1 mb-2">
                    {[
                      { value: 'from-gray-900 to-gray-800', label: 'Dark Gray' },
                      { value: 'from-blue-900 to-gray-900', label: 'Deep Ocean' },
                      { value: 'from-purple-900 to-gray-900', label: 'Mystic Night' },
                      { value: 'from-green-900 to-gray-900', label: 'Forest Dark' },
                      { value: 'from-red-900 to-gray-900', label: 'Ruby Night' },
                      { value: 'from-indigo-900 to-purple-900', label: 'Cosmic Purple' },
                      { value: 'from-blue-600 to-purple-700', label: 'Electric Dreams' },
                      { value: 'from-green-600 to-blue-800', label: 'Northern Lights' },
                      { value: 'from-pink-600 to-purple-900', label: 'Neon Sunset' },
                      { value: 'from-yellow-600 to-red-900', label: 'Warm Dusk' },
                      { value: 'from-cyan-600 to-blue-900', label: 'Ocean Depths' },
                      { value: 'from-violet-600 to-indigo-900', label: 'Midnight Violet' }
                    ].map((gradient) => (
                      <button
                        key={gradient.value}
                        onClick={() => setBackground(prev => ({ ...prev, gradient: gradient.value }))}
                        className={`h-20 rounded-md bg-gradient-to-br ${gradient.value} p-2 text-xs text-white/80 hover:text-white transition-colors ${
                          background.gradient === gradient.value ? 'ring-2 ring-white' : ''
                        }`}
                      >
                        {gradient.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {background.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={background.image}
                    onChange={(e) => setBackground(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL"
                    className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-400">Paste a direct image URL (ends with .jpg, .png, etc)</p>
                </div>
              )}

              {background.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL</label>
                  <input
                    type="text"
                    value={background.video}
                    onChange={(e) => setBackground(prev => ({ ...prev, video: e.target.value }))}
                    placeholder="Enter video URL"
                    className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-400">Paste a direct video URL (ends with .mp4)</p>
                </div>
              )}

              {(background.type === 'image' || background.type === 'video') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Opacity</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={background.opacity}
                    onChange={(e) => setBackground(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{Math.round(background.opacity * 100)}%</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Toggle button when panel is closed */}
        <motion.button
          initial={{ opacity: 0, x: -280 }}
          animate={{ 
            opacity: isPanelOpen ? 0 : 1, 
            x: isPanelOpen ? -280 : 0,
            pointerEvents: isPanelOpen ? "none" : "auto"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={() => setIsPanelOpen(true)}
          className="fixed left-4 top-4 z-40 p-2 bg-gray-900/95 backdrop-blur-sm shadow-xl border border-gray-800 rounded-full hover:bg-gray-800 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </motion.button>

        {/* Main Content */}
        <main 
          className={`flex-1 min-h-screen flex flex-col items-center justify-center transition-all duration-300 ${
            isPanelOpen ? 'ml-[280px]' : 'ml-0'
          }`}
        >
          <div className="w-full max-w-4xl p-8">
            {/* Timer */}
            <div className="mb-8 flex justify-center">
              {selectedEvent ? (
                <Timer 
                  targetDate={selectedEvent.date}
                  timezone={selectedEvent.timezone}
                  color={selectedEvent.color}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-xl">No event selected</p>
                  <p className="mt-2">Select an event from below or create a new one</p>
                </div>
              )}
            </div>

            {/* Events List */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Events</h2>
                <button
                  onClick={addNewEvent}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors flex items-center gap-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Event
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.length === 0 ? (
                  <div className="col-span-full text-center py-8 bg-white/5 rounded-lg">
                    <p className="text-gray-400">No events yet</p>
                    <button
                      onClick={addNewEvent}
                      className="mt-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Create your first event
                    </button>
                  </div>
                ) : (
                  events.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isSelected={selectedEvent?.id === event.id}
                      onClick={() => setSelectedEvent(event)}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
