import { createContext, useContext, useState } from 'react';

export const ModeContext = createContext({ mode: 'custom', setMode: () => {} });

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('custom');
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      <div className={mode === 'powerbi' ? 'mode-powerbi' : ''} style={{ height: '100%' }}>
        {children}
      </div>
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);
