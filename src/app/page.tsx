'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from '@/components/Timer';
import EventCard from '@/components/EventCard';
import { events as defaultEvents, Event } from '@/data/events';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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
      color: "from-blue-500 to-purple-600 bg-gradient-to-br"
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
    <main className={`min-h-screen text-white ${backgroundStyles[background.type as keyof typeof backgroundStyles]}`}
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

      <div className="flex h-screen overflow-hidden">
        {/* Left Side Panel */}
        <motion.div 
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className="w-70 min-w-[280px] h-screen bg-gray-900/95 backdrop-blur-sm shadow-xl border-r border-gray-800 flex flex-col fixed left-0 top-0 z-50"
        >
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-bold">Background Settings</h3>
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

        {/* Main Content */}
        <div className="ml-[280px] min-h-screen flex items-center justify-center">
          <motion.div 
            className="w-full max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-16">
              {selectedEvent ? (
                <div className="flex flex-col items-center">
                  <div className="w-full flex justify-center mb-12">
                    <Timer targetDate={selectedEvent.date} color={selectedEvent.color} />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={selectedEvent.id}
                      className="w-full text-center space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <motion.h1 
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                      >
                        {selectedEvent.title}
                      </motion.h1>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p className="text-lg sm:text-xl text-white/90">
                          {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {selectedEvent.description && (
                          <p className="text-base sm:text-lg text-white/70">{selectedEvent.description}</p>
                        )}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Create Your First Event
                  </h1>
                  <p className="text-lg sm:text-xl text-white/70">
                    Add an event to start counting down!
                  </p>
                </div>
              )}

              <motion.div layout>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isSelected={selectedEvent?.id === event.id}
                      onClick={() => setSelectedEvent(event)}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                  <motion.button
                    onClick={addNewEvent}
                    className="cursor-pointer p-4 sm:p-6 rounded-xl transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-lg border-2 border-dashed border-white/20 flex items-center justify-center h-full min-h-[200px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl font-bold text-white/70">+ Add New Event</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
