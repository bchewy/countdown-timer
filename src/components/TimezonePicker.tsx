'use client';

import { useState, useEffect } from 'react';

interface TimezonePickerProps {
  value: string;
  onChange: (timezone: string) => void;
}

export default function TimezonePicker({ value, onChange }: TimezonePickerProps) {
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    // Get list of IANA timezones
    const zones = Intl.supportedValuesOf('timeZone');
    setTimezones(zones);
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 rounded-md px-3 py-2 text-white"
    >
      {timezones.map((zone) => (
        <option key={zone} value={zone}>
          {zone} ({new Date().toLocaleTimeString('en-US', { timeZone: zone })})
        </option>
      ))}
    </select>
  );
}
