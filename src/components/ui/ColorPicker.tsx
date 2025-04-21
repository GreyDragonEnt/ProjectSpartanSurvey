import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-1/3">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
      <div className="w-2/3 flex gap-2">
        <div 
          className="relative w-8 h-8 overflow-hidden rounded border border-gray-300"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

export default ColorPicker;