'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import gsap from 'gsap';

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
}

interface TimerProps {
  targetDate: string;
  color?: string;
  showParticles?: boolean;
  particleCount?: number;
  showGlow?: boolean;
  showShockwave?: boolean;
  animationStyle?: 'flip' | 'fade' | 'bounce' | 'slide';
  particleSpeed?: number;
  particleSize?: number;
  bgOpacity?: number;
  textShadow?: number;
  animationSpeed?: number;
  pulseEffect?: boolean;
  rippleEffect?: boolean;
  numberStyle?: 'normal' | 'neon' | 'metallic' | 'glass' | 'retro' | 'glitch' | 'matrix';
  particleStyle?: 'circle' | 'star' | 'trail' | 'sparkle';
  backgroundStyle?: 'gradient' | 'mesh' | 'dots' | 'circuit' | 'matrix';
  cardHoverEffect?: 'tilt' | 'flip' | 'glow' | 'scale' | 'none';
}

interface StyleControlsProps {
  color: string;
  showParticles: boolean;
  particleCount: number;
  showGlow: boolean;
  showShockwave: boolean;
  animationStyle: 'flip' | 'fade' | 'bounce' | 'slide';
  particleSpeed: number;
  particleSize: number;
  bgOpacity: number;
  textShadow: number;
  animationSpeed: number;
  pulseEffect: boolean;
  rippleEffect: boolean;
  numberStyle: 'normal' | 'neon' | 'metallic' | 'glass' | 'retro' | 'glitch' | 'matrix';
  particleStyle: 'circle' | 'star' | 'trail' | 'sparkle';
  backgroundStyle: 'gradient' | 'mesh' | 'dots' | 'circuit' | 'matrix';
  cardHoverEffect: 'tilt' | 'flip' | 'glow' | 'scale' | 'none';
  onStyleChange: <K extends keyof TimerStyle>(key: K, value: TimerStyle[K]) => void;
  presets: Preset[];
  setPresets: (presets: Preset[]) => void;
}

interface TimerStyle {
  color: string;
  showParticles: boolean;
  particleCount: number;
  showGlow: boolean;
  showShockwave: boolean;
  animationStyle: 'flip' | 'fade' | 'bounce' | 'slide';
  particleSpeed: number;
  particleSize: number;
  bgOpacity: number;
  textShadow: number;
  animationSpeed: number;
  pulseEffect: boolean;
  rippleEffect: boolean;
  numberStyle: 'normal' | 'neon' | 'metallic' | 'glass' | 'retro' | 'glitch' | 'matrix';
  particleStyle: 'circle' | 'star' | 'trail' | 'sparkle';
  backgroundStyle: 'gradient' | 'mesh' | 'dots' | 'circuit' | 'matrix';
  cardHoverEffect: 'tilt' | 'flip' | 'glow' | 'scale' | 'none';
}

interface Preset {
  id: string;
  name: string;
  styles: TimerStyle;
  isBuiltIn?: boolean;
}

const builtInPresets: Preset[] = [
  {
    id: 'cyberpunk',
    name: '🌆 Cyberpunk',
    isBuiltIn: true,
    styles: {
      color: 'from-pink-500 to-purple-600',
      showParticles: true,
      particleCount: 30,
      showGlow: true,
      showShockwave: true,
      animationStyle: 'flip',
      particleSpeed: 3,
      particleSize: 2,
      bgOpacity: 0.9,
      textShadow: 1,
      animationSpeed: 1.2,
      pulseEffect: true,
      rippleEffect: true,
      numberStyle: 'neon',
      particleStyle: 'sparkle',
      backgroundStyle: 'circuit',
      cardHoverEffect: 'tilt'
    }
  },
  {
    id: 'minimal',
    name: '✨ Minimal',
    isBuiltIn: true,
    styles: {
      color: 'from-gray-500 to-gray-600',
      showParticles: false,
      particleCount: 5,
      showGlow: false,
      showShockwave: false,
      animationStyle: 'fade',
      particleSpeed: 1,
      particleSize: 1,
      bgOpacity: 0.7,
      textShadow: 0.3,
      animationSpeed: 1,
      pulseEffect: false,
      rippleEffect: false,
      numberStyle: 'glass',
      particleStyle: 'circle',
      backgroundStyle: 'gradient',
      cardHoverEffect: 'scale'
    }
  },
  {
    id: 'nature',
    name: '🌿 Nature',
    isBuiltIn: true,
    styles: {
      color: 'from-green-500 to-emerald-600',
      showParticles: true,
      particleCount: 20,
      showGlow: true,
      showShockwave: false,
      animationStyle: 'bounce',
      particleSpeed: 1.5,
      particleSize: 2.5,
      bgOpacity: 0.85,
      textShadow: 0.5,
      animationSpeed: 0.8,
      pulseEffect: true,
      rippleEffect: false,
      numberStyle: 'normal',
      particleStyle: 'trail',
      backgroundStyle: 'dots',
      cardHoverEffect: 'glow'
    }
  },
  {
    id: 'retro-gaming',
    name: '🎮 Retro Gaming',
    isBuiltIn: true,
    styles: {
      color: 'from-indigo-500 to-purple-600',
      showParticles: true,
      particleCount: 15,
      showGlow: true,
      showShockwave: true,
      animationStyle: 'slide',
      particleSpeed: 2,
      particleSize: 3,
      bgOpacity: 1,
      textShadow: 0.8,
      animationSpeed: 1.5,
      pulseEffect: false,
      rippleEffect: true,
      numberStyle: 'retro',
      particleStyle: 'star',
      backgroundStyle: 'circuit',
      cardHoverEffect: 'flip'
    }
  },
  {
    id: 'matrix',
    name: '🖥️ Matrix',
    isBuiltIn: true,
    styles: {
      color: 'from-green-500 to-emerald-600',
      showParticles: true,
      particleCount: 25,
      showGlow: true,
      showShockwave: false,
      animationStyle: 'fade',
      particleSpeed: 2.5,
      particleSize: 1.5,
      bgOpacity: 1,
      textShadow: 0.9,
      animationSpeed: 1.3,
      pulseEffect: false,
      rippleEffect: false,
      numberStyle: 'matrix',
      particleStyle: 'trail',
      backgroundStyle: 'matrix',
      cardHoverEffect: 'glow'
    }
  },
  {
    id: 'neon-nights',
    name: '🌙 Neon Nights',
    isBuiltIn: true,
    styles: {
      color: 'from-fuchsia-500 to-pink-600',
      showParticles: true,
      particleCount: 35,
      showGlow: true,
      showShockwave: true,
      animationStyle: 'bounce',
      particleSpeed: 2,
      particleSize: 2,
      bgOpacity: 0.95,
      textShadow: 1,
      animationSpeed: 1.2,
      pulseEffect: true,
      rippleEffect: true,
      numberStyle: 'neon',
      particleStyle: 'sparkle',
      backgroundStyle: 'mesh',
      cardHoverEffect: 'tilt'
    }
  },
  {
    id: 'glitch',
    name: '🌐 Glitch',
    isBuiltIn: true,
    styles: {
      color: 'from-cyan-500 to-blue-600',
      showParticles: true,
      particleCount: 20,
      showGlow: true,
      showShockwave: true,
      animationStyle: 'slide',
      particleSpeed: 3,
      particleSize: 2,
      bgOpacity: 1,
      textShadow: 0.8,
      animationSpeed: 1.5,
      pulseEffect: false,
      rippleEffect: true,
      numberStyle: 'glitch',
      particleStyle: 'sparkle',
      backgroundStyle: 'circuit',
      cardHoverEffect: 'flip'
    }
  },
  {
    id: 'elegant',
    name: '✨ Elegant',
    isBuiltIn: true,
    styles: {
      color: 'from-amber-500 to-orange-600',
      showParticles: true,
      particleCount: 15,
      showGlow: true,
      showShockwave: false,
      animationStyle: 'fade',
      particleSpeed: 1,
      particleSize: 1.5,
      bgOpacity: 0.8,
      textShadow: 0.6,
      animationSpeed: 0.8,
      pulseEffect: true,
      rippleEffect: false,
      numberStyle: 'metallic',
      particleStyle: 'star',
      backgroundStyle: 'gradient',
      cardHoverEffect: 'glow'
    }
  },
  {
    id: 'cosmic',
    name: '🌌 Cosmic',
    isBuiltIn: true,
    styles: {
      color: 'from-violet-500 to-fuchsia-600',
      showParticles: true,
      particleCount: 40,
      showGlow: true,
      showShockwave: true,
      animationStyle: 'flip',
      particleSpeed: 2.5,
      particleSize: 2,
      bgOpacity: 1,
      textShadow: 0.9,
      animationSpeed: 1.2,
      pulseEffect: true,
      rippleEffect: true,
      numberStyle: 'glass',
      particleStyle: 'sparkle',
      backgroundStyle: 'dots',
      cardHoverEffect: 'tilt'
    }
  },
  {
    id: 'underwater',
    name: '🌊 Underwater',
    isBuiltIn: true,
    styles: {
      color: 'from-blue-400 to-emerald-600',
      showParticles: true,
      particleCount: 30,
      showGlow: true,
      showShockwave: false,
      animationStyle: 'bounce',
      particleSpeed: 1,
      particleSize: 2,
      bgOpacity: 0.85,
      textShadow: 0.7,
      animationSpeed: 0.8,
      pulseEffect: true,
      rippleEffect: true,
      numberStyle: 'glass',
      particleStyle: 'trail',
      backgroundStyle: 'mesh',
      cardHoverEffect: 'scale'
    }
  }
];

const StyleControls = ({ color, showParticles, particleCount, showGlow, showShockwave, animationStyle, particleSpeed, particleSize, bgOpacity, textShadow, animationSpeed, pulseEffect, rippleEffect, numberStyle, particleStyle, backgroundStyle, cardHoverEffect, onStyleChange, presets, setPresets }: StyleControlsProps) => {
  const gradients = [
    // Cool Tones
    "from-blue-500 to-purple-600",
    "from-cyan-500 to-blue-600",
    "from-indigo-500 to-purple-600",
    "from-violet-500 to-fuchsia-600",
    "from-blue-400 to-emerald-600",
    
    // Warm Tones
    "from-red-500 to-pink-600",
    "from-orange-500 to-red-600",
    "from-amber-500 to-orange-600",
    "from-yellow-500 to-orange-600",
    "from-rose-500 to-red-600",
    
    // Nature Tones
    "from-green-500 to-teal-600",
    "from-emerald-500 to-green-600",
    "from-teal-500 to-cyan-600",
    "from-lime-500 to-green-600",
    "from-green-400 to-cyan-600",

    // Vibrant
    "from-fuchsia-500 to-pink-600",
    "from-purple-500 to-indigo-600",
    "from-pink-500 to-rose-600",
    "from-violet-500 to-indigo-600",
    "from-blue-500 to-violet-600"
  ];

  const [presetName, setPresetName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const savePreset = () => {
    if (!presetName.trim()) return;

    const currentStyles: TimerStyle = {
      color,
      showParticles,
      particleCount,
      showGlow,
      showShockwave,
      animationStyle,
      particleSpeed,
      particleSize,
      bgOpacity,
      textShadow,
      animationSpeed,
      pulseEffect,
      rippleEffect,
      numberStyle,
      particleStyle,
      backgroundStyle,
      cardHoverEffect,
    };

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      styles: currentStyles
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    
    // Save to localStorage
    const customPresets = updatedPresets.filter(p => !p.isBuiltIn);
    localStorage.setItem('timerPresets', JSON.stringify(customPresets));
    
    setPresetName('');
  };

  const loadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      Object.entries(preset.styles).forEach(([key, value]) => {
        onStyleChange(key as keyof TimerStyle, value);
      });
    }
  };

  const deletePreset = (presetId: string) => {
    const updatedPresets = presets.filter(p => p.id !== presetId);
    setPresets(updatedPresets);
    
    // Update localStorage
    const customPresets = updatedPresets.filter(p => !p.isBuiltIn);
    localStorage.setItem('timerPresets', JSON.stringify(customPresets));
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-72 bg-gray-900/95 text-white shadow-xl backdrop-blur-sm z-50">
      <div className="h-full flex flex-col">
        <div className="flex-none p-4 border-b border-gray-800">
          <h3 className="text-lg font-bold">Style Controls</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="border-b border-gray-800 pb-4">
                <h4 className="text-sm font-medium mb-3">Presets</h4>
                
                <div className="space-y-3">
                  <select
                    value={selectedPreset}
                    onChange={(e) => {
                      setSelectedPreset(e.target.value);
                      loadPreset(e.target.value);
                    }}
                    className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select a preset</option>
                    <optgroup label="Built-in Presets">
                      {presets.filter(p => p.isBuiltIn).map(preset => (
                        <option key={preset.id} value={preset.id}>
                          {preset.name}
                        </option>
                      ))}
                    </optgroup>
                    {presets.some(p => !p.isBuiltIn) && (
                      <optgroup label="Custom Presets">
                        {presets.filter(p => !p.isBuiltIn).map(preset => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Preset name"
                      className="flex-1 bg-gray-800 rounded-md px-3 py-2 text-sm"
                    />
                    <button
                      onClick={savePreset}
                      className="px-3 py-2 bg-gray-800 rounded-md text-sm hover:bg-gray-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>

                  {selectedPreset && !presets.find(p => p.id === selectedPreset)?.isBuiltIn && (
                    <button
                      onClick={() => deletePreset(selectedPreset)}
                      className="w-full px-3 py-2 bg-red-900/50 rounded-md text-sm hover:bg-red-900/70 transition-colors"
                    >
                      Delete Selected Preset
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color Theme</label>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                  {gradients.map((gradient) => (
                    <button
                      key={gradient}
                      className={`w-full aspect-square rounded-md bg-gradient-to-br ${gradient} ${color === gradient ? 'ring-2 ring-white scale-90' : 'hover:scale-95'} transition-transform duration-200`}
                      onClick={() => onStyleChange('color', gradient)}
                    />
                  ))}
                </div>
              </div>

              <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 8px;
                  height: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(0, 0, 0, 0.1);
                  border-radius: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.2);
                  border-radius: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(255, 255, 255, 0.3);
                }

                input[type="range"] {
                  -webkit-appearance: none;
                  width: 100%;
                  height: 6px;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 3px;
                  outline: none;
                }

                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 16px;
                  height: 16px;
                  background: white;
                  border-radius: 50%;
                  cursor: pointer;
                  transition: all 0.2s;
                }

                input[type="range"]::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                }

                input[type="range"]::-webkit-slider-thumb:active {
                  transform: scale(0.9);
                }
              `}</style>

              <div>
                <label className="block text-sm font-medium mb-2">Animation Style</label>
                <select
                  value={animationStyle}
                  onChange={(e) => onStyleChange('animationStyle', e.target.value as TimerStyle['animationStyle'])}
                  className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                >
                  <option value="flip">Flip</option>
                  <option value="fade">Fade</option>
                  <option value="bounce">Bounce</option>
                  <option value="slide">Slide</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showParticles}
                    onChange={(e) => onStyleChange('showParticles', e.target.checked)}
                    className="rounded bg-gray-800"
                  />
                  <span className="text-sm font-medium">Show Particles</span>
                </label>
              </div>

              {showParticles && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Particle Count</label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={particleCount}
                      onChange={(e) => onStyleChange('particleCount', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{particleCount} particles</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Particle Speed</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={particleSpeed}
                      onChange={(e) => onStyleChange('particleSpeed', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{particleSpeed}x speed</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Particle Size</label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.5"
                      value={particleSize}
                      onChange={(e) => onStyleChange('particleSize', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{particleSize}x size</span>
                  </div>
                </>
              )}

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGlow}
                    onChange={(e) => onStyleChange('showGlow', e.target.checked)}
                    className="rounded bg-gray-800"
                  />
                  <span className="text-sm font-medium">Glow Effect</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showShockwave}
                    onChange={(e) => onStyleChange('showShockwave', e.target.checked)}
                    className="rounded bg-gray-800"
                  />
                  <span className="text-sm font-medium">Shockwave Effect</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background Opacity</label>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.1"
                  value={bgOpacity}
                  onChange={(e) => onStyleChange('bgOpacity', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{Math.round(bgOpacity * 100)}% opacity</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Text Shadow</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={textShadow}
                  onChange={(e) => onStyleChange('textShadow', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{Math.round(textShadow * 100)}% intensity</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Animation Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={animationSpeed}
                  onChange={(e) => onStyleChange('animationSpeed', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{animationSpeed}x speed</span>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-sm font-medium mb-3">Special Effects</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={pulseEffect}
                        onChange={(e) => onStyleChange('pulseEffect', e.target.checked)}
                        className="rounded bg-gray-800"
                      />
                      <span className="text-sm font-medium">Pulse Effect</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rippleEffect}
                        onChange={(e) => onStyleChange('rippleEffect', e.target.checked)}
                        className="rounded bg-gray-800"
                      />
                      <span className="text-sm font-medium">Ripple Effect</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Number Style</label>
                    <select
                      value={numberStyle}
                      onChange={(e) => onStyleChange('numberStyle', e.target.value as TimerStyle['numberStyle'])}
                      className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="neon">Neon</option>
                      <option value="metallic">Metallic</option>
                      <option value="glass">Glass</option>
                      <option value="retro">Retro</option>
                      <option value="glitch">Glitch</option>
                      <option value="matrix">Matrix</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Particle Style</label>
                    <select
                      value={particleStyle}
                      onChange={(e) => onStyleChange('particleStyle', e.target.value as TimerStyle['particleStyle'])}
                      className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="circle">Circle</option>
                      <option value="star">Star</option>
                      <option value="trail">Trail</option>
                      <option value="sparkle">Sparkle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Background Style</label>
                    <select
                      value={backgroundStyle}
                      onChange={(e) => onStyleChange('backgroundStyle', e.target.value as TimerStyle['backgroundStyle'])}
                      className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="gradient">Gradient</option>
                      <option value="mesh">Mesh</option>
                      <option value="dots">Dots</option>
                      <option value="circuit">Circuit</option>
                      <option value="matrix">Matrix Rain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Card Hover Effect</label>
                    <select
                      value={cardHoverEffect}
                      onChange={(e) => onStyleChange('cardHoverEffect', e.target.value as TimerStyle['cardHoverEffect'])}
                      className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="none">None</option>
                      <option value="tilt">3D Tilt</option>
                      <option value="flip">Flip</option>
                      <option value="glow">Glow</option>
                      <option value="scale">Scale</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RippleEffect = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0 rounded-xl border-4 border-white/40"
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{
          scale: [0.8, 1.3, 1.8],
          opacity: [0.8, 0.4, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl border-4 border-white/40"
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{
          scale: [0.8, 1.3, 1.8],
          opacity: [0.8, 0.4, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.75
        }}
      />
    </div>
  );
};

const PulseEffect = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [0.85, 1.05, 0.85],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

const ShockwaveEffect = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0 rounded-xl border-4 border-white/30"
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{
          scale: [0.8, 2, 2.5],
          opacity: [0.8, 0.3, 0],
          borderWidth: ["4px", "2px", "0px"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl bg-white/10"
        initial={{ scale: 0.8, opacity: 0.3 }}
        animate={{
          scale: [0.8, 1.5, 2],
          opacity: [0.3, 0.1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5
        }}
      />
    </div>
  );
};

const MatrixRain = () => {
  const characters = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:・.=*+-<>¦｜╌';
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl bg-black/30">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-sm font-mono text-green-400/60"
          initial={{ y: -100, x: Math.random() * 100 }}
          animate={{
            y: [null, 300],
            opacity: [0.8, 0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
          style={{ left: `${i * 7}%` }}
        >
          {[...Array(15)].map((_, j) => (
            <motion.div 
              key={j} 
              className="my-1"
              animate={{
                opacity: [0.5, 1, 0.5],
                color: ['rgb(34,197,94)', 'rgb(0,255,0)', 'rgb(34,197,94)']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: j * 0.1
              }}
            >
              {characters[Math.floor(Math.random() * characters.length)]}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default function Timer({ 
  targetDate, 
  color = "from-blue-500 to-purple-600",
  showParticles = true,
  particleCount = 20,
  showGlow = true,
  showShockwave = true,
  animationStyle = 'flip',
  particleSpeed = 2,
  particleSize = 2,
  bgOpacity = 1,
  textShadow = 0.7,
  animationSpeed = 1,
  pulseEffect = false,
  rippleEffect = false,
  numberStyle = 'normal',
  particleStyle = 'circle',
  backgroundStyle = 'gradient',
  cardHoverEffect = 'scale'
}: TimerProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    expired: false,
  });
  const [styles, setStyles] = useState<TimerStyle>({
    color,
    showParticles,
    particleCount,
    showGlow,
    showShockwave,
    animationStyle,
    particleSpeed,
    particleSize,
    bgOpacity,
    textShadow,
    animationSpeed,
    pulseEffect,
    rippleEffect,
    numberStyle,
    particleStyle,
    backgroundStyle,
    cardHoverEffect,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const prevTimeLeft = useRef<TimeLeft>(timeLeft);

  const [presets, setPresets] = useState<Preset[]>(() => {
    if (typeof window !== 'undefined') {
      const savedPresets = localStorage.getItem('timerPresets');
      return savedPresets ? [...builtInPresets, ...JSON.parse(savedPresets)] : builtInPresets;
    }
    return builtInPresets;
  });

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const total = Date.parse(targetDate) - Date.now();
      
      if (total <= 0) {
        return {
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          expired: true,
        };
      }

      return {
        days: Math.floor(total / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
        minutes: Math.floor((total / 1000 / 60) % 60).toString().padStart(2, '0'),
        seconds: Math.floor((total / 1000) % 60).toString().padStart(2, '0'),
        expired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Shockwave animation
  useEffect(() => {
    if (timeLeft.seconds !== prevTimeLeft.current.seconds && containerRef.current && styles.showShockwave) {
      gsap.to(containerRef.current, {
        duration: 0.5,
        scale: 1.02,
        ease: "elastic.out(1, 0.3)",
        yoyo: true,
        repeat: 1
      });

      const shockwave = document.createElement('div');
      shockwave.className = 'absolute inset-0 animate-shockwave';
      containerRef.current.appendChild(shockwave);
      setTimeout(() => shockwave.remove(), 1000);
    }
    prevTimeLeft.current = timeLeft;
  }, [timeLeft, styles.showShockwave]);

  const flipProps = useSpring({
    to: { rotateX: 0 },
    from: { rotateX: 180 },
    reset: true,
  });

  const getAnimationProps = (value: string) => {
    switch (styles.animationStyle) {
      case 'flip':
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.5, opacity: 0 },
          transition: { type: "spring", stiffness: 500, damping: 30, mass: 1 }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 }
        };
      case 'bounce':
        return {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 },
          transition: { type: "spring", stiffness: 300, damping: 15 }
        };
      case 'slide':
        return {
          initial: { x: -30, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 30, opacity: 0 },
          transition: { duration: 0.3 }
        };
      default:
        return {};
    }
  };

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  const handleStyleChange = <K extends keyof TimerStyle>(key: K, value: TimerStyle[K]) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const getNumberStyles = (style: string): React.CSSProperties => {
    switch (style) {
      case 'neon':
        return {
          textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 25px #0ff',
          color: '#fff'
        };
      case 'metallic':
        return {
          background: 'linear-gradient(to bottom, #fff 0%, #888 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))'
        };
      case 'glass':
        return {
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 2px 4px rgba(255,255,255,0.5)',
          filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))',
          mixBlendMode: 'overlay'
        };
      case 'retro':
        return {
          fontFamily: '"Press Start 2P", cursive',
          textShadow: '2px 2px 0px #000',
          letterSpacing: '2px'
        };
      case 'glitch':
        return {
          position: 'relative',
          animation: 'glitch 0.5s infinite',
          color: '#fff'
        };
      case 'matrix':
        return {
          color: '#00ff00',
          fontFamily: 'monospace',
          textShadow: '0 0 8px #00ff00',
          letterSpacing: '2px',
          animation: 'pulse 2s infinite'
        };
      default:
        return {};
    }
  };

  const getParticleClassName = (style: string, index: number) => {
    switch (style) {
      case 'star':
        return 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'trail':
        return 'animate-trail';
      case 'sparkle':
        return 'animate-sparkle';
      default:
        return 'rounded-full';
    }
  };

  const getBackgroundPattern = (style: string) => {
    switch (style) {
      case 'mesh':
        return {
          backgroundImage: `
            radial-gradient(at 40% 20%, rgba(255,255,255,0.1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(255,255,255,0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(255,255,255,0.1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgba(255,255,255,0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(255,255,255,0.1) 0px, transparent 50%),
            radial-gradient(at 80% 100%, rgba(255,255,255,0.1) 0px, transparent 50%),
            radial-gradient(at 0% 0%, rgba(255,255,255,0.1) 0px, transparent 50%)
          `
        };
      case 'dots':
        return {
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        };
      case 'circuit':
        return {
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        };
      default:
        return {};
    }
  };

  const getCardHoverEffect = (effect: string) => {
    switch (effect) {
      case 'tilt':
        return {
          scale: 1.05,
          rotateX: 10,
          rotateY: -10,
          transition: { duration: 0.2 }
        };
      case 'flip':
        return {
          rotateX: 180,
          transition: { duration: 0.5 }
        };
      case 'glow':
        return {
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.7))'
        };
      case 'scale':
        return {
          scale: 1.1,
          transition: { duration: 0.2 }
        };
      case 'none':
        return {};
      default:
        return {};
    }
  };

  if (!mounted) return null;

    return (
    <>
      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-4" onClick={(e) => e.stopPropagation()}>
        <style jsx global>{`
          @keyframes shockwave {
            0% {
              transform: scale(1);
              opacity: 1;
              border: 2px solid white;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
              border: 2px solid transparent;
            }
          }
          
          @keyframes trail {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
              filter: blur(0px);
            }
            100% {
              transform: translate(var(--tx, 50px), var(--ty, 50px)) scale(0);
              opacity: 0;
              filter: blur(4px);
            }
          }
          
          @keyframes sparkle {
            0% {
              transform: translate(0, 0) scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: translate(var(--tx, 50px), var(--ty, 50px)) scale(1) rotate(180deg);
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx, 50px), var(--ty, 50px)) scale(0) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes glitch {
            0% {
              transform: translate(0);
              text-shadow: 2px 2px #ff0000, -2px -2px #00ff00, 1px -1px #0000ff;
            }
            20% {
              transform: translate(-2px, 2px);
              text-shadow: -2px -2px #ff0000, 2px 2px #00ff00, -1px 1px #0000ff;
            }
            40% {
              transform: translate(2px, -2px);
              text-shadow: 1px -1px #ff0000, -1px 1px #00ff00, 2px -2px #0000ff;
            }
            60% {
              transform: translate(-2px, -2px);
              text-shadow: -2px 2px #ff0000, 2px -2px #00ff00, 1px 1px #0000ff;
            }
            80% {
              transform: translate(2px, 2px);
              text-shadow: 2px -2px #ff0000, -2px 2px #00ff00, -1px -1px #0000ff;
            }
            100% {
              transform: translate(0);
              text-shadow: 2px 2px #ff0000, -2px -2px #00ff00, 1px -1px #0000ff;
            }
          }
          
          .animate-trail {
            animation: trail 1s linear forwards;
          }
          
          .animate-sparkle {
            animation: sparkle 1s ease-in-out infinite;
          }
          
          .animate-shockwave {
            animation: shockwave 1s ease-out forwards;
            border-radius: 1rem;
          }
          
          .glow {
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.7));
          }
          
          .star-shape {
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          }
        `}</style>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {timeBlocks.map(({ label, value }, index) => (
            <motion.div
              key={label}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${styles.color} p-4 sm:p-6 text-center shadow-xl`}
              style={{
                opacity: styles.bgOpacity,
                ...(styles.backgroundStyle !== 'gradient' && styles.backgroundStyle !== 'matrix' ? getBackgroundPattern(styles.backgroundStyle) : {})
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: styles.bgOpacity, y: 0 }}
              transition={{ delay: index * 0.1 * styles.animationSpeed }}
              whileHover={getCardHoverEffect(styles.cardHoverEffect)}
            >
              {styles.showShockwave && <ShockwaveEffect />}
              {styles.rippleEffect && <RippleEffect />}
              {styles.pulseEffect && <PulseEffect />}
              {styles.backgroundStyle === 'matrix' && <MatrixRain />}
              
                <motion.span
                  key={value}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold relative z-10`}
                style={{
                  ...getNumberStyles(styles.numberStyle),
                  filter: `drop-shadow(0 0 ${styles.textShadow * 10}px rgba(255,255,255,${styles.textShadow * 0.7}))`
                }}
                {...getAnimationProps(value)}
                >
                  {value}
                </motion.span>
              
              {styles.showParticles && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(styles.particleCount)].map((_, i) => {
                    const angle = (Math.random() * Math.PI * 2);
                    const distance = Math.random() * 100 + 50;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    
                    const getParticleAnimation = () => {
                      switch (styles.particleStyle) {
                        case 'sparkle':
                          return {
                            initial: { x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 },
                            animate: {
                              x: tx,
                              y: ty,
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                              rotate: [0, 180, 360]
                            },
                            transition: {
                              duration: 1.5 / styles.particleSpeed,
                              repeat: Infinity,
                              ease: "easeInOut",
                              times: [0, 0.5, 1]
                            }
                          };
                        case 'trail':
                          return {
                            initial: { x: 0, y: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
                            animate: {
                              x: tx,
                              y: ty,
                              scale: [1, 0.5, 0],
                              opacity: [1, 0.5, 0],
                              filter: ["blur(0px)", "blur(2px)", "blur(4px)"]
                            },
                            transition: {
                              duration: 2 / styles.particleSpeed,
                              repeat: Infinity,
                              ease: "linear"
                            }
                          };
                        default:
                          return {
                            initial: { x: 0, y: 0, scale: 0, opacity: 0 },
                            animate: {
                              x: tx,
                              y: ty,
                              scale: [0, 1, 0],
                              opacity: [0, 0.9, 0]
                            },
                            transition: {
                              duration: 2 / styles.particleSpeed,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.1
                            }
                          };
                      }
                    };

                    return (
              <motion.div
                key={i}
                        className={`absolute ${
                          styles.particleStyle === 'star' ? 'star-shape' : 'rounded-full'
                        } ${
                          i % 3 === 0 ? 'bg-white' : i % 3 === 1 ? 'bg-white/70' : 'bg-white/40'
                        }`}
                        style={{
                          width: `${0.5 * styles.particleSize}rem`,
                          height: `${0.5 * styles.particleSize}rem`,
                          filter: styles.showGlow ? 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' : 'none',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                        {...getParticleAnimation()}
                      />
                    );
                  })}
          </div>
              )}
            </motion.div>
        ))}
      </div>
    </div>
      <StyleControls {...styles} onStyleChange={handleStyleChange} presets={presets} setPresets={setPresets} />
    </>
  );
}
