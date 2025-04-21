import React, { createContext, useContext, useState } from 'react';

export interface ThemeSettings {
  backgroundColor: string;
  questionColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  inputBorderColor: string;
  inputFocusColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  radioColor: string;
  checkboxColor: string;
  dropdownBorderColor: string;
  ratingActiveColor: string;
  ratingInactiveColor: string;
  scaleActiveColor: string;
  scaleInactiveColor: string;
  headerTextColor: string;
  descriptionTextColor: string;
}

const defaultTheme: ThemeSettings = {
  backgroundColor: '#F4F5F7',
  questionColor: '#FFFFFF',
  textColor: '#111827',
  accentColor: '#5D5FEF',
  borderColor: '#E5E7EB',
  inputBorderColor: '#D1D5DB',
  inputFocusColor: '#5D5FEF',
  buttonTextColor: '#FFFFFF',
  buttonHoverColor: '#4F46E5',
  radioColor: '#5D5FEF',
  checkboxColor: '#5D5FEF',
  dropdownBorderColor: '#D1D5DB',
  ratingActiveColor: '#F9A826',
  ratingInactiveColor: '#E5E7EB',
  scaleActiveColor: '#23C4A2',
  scaleInactiveColor: '#E5E7EB',
  headerTextColor: '#FFFFFF',
  descriptionTextColor: 'rgba(255, 255, 255, 0.9)'
};

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};