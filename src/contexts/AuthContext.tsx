import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const validCredentials: Record<string, string> = {
  'comet-trail': 'G7!fR2kL9qM1',
  'lunar-bridge': 'Vt#4pZ8uQm6s',
  'pixel-harbor': 'xR9$eJ3bT6yW',
  'amber-orbit': 'H2!nP7vC5sL0',
  'frost-canvas': 'kM8@qF4rY1zD',
  'echo-delta': 'S5#bT9uL2mK7',
  'iron-lattice': 'wQ3$gN8vR6pF',
  'velvet-arcade': 'Z1!hC6tJ9rX4',
  'neon-grove': 'P4#sM7kV2qL8',
  'prism-haven': 'dR8@fY3nW5zK',
  'cobalt-spark': 'L6!vT1pG9mQ3',
  'moss-vector': 'B9#qH4rS2kZ7',
  'ember-shift': 'tF2@cV8wN5yP',
  'orbit-lumen': 'M3!pK7zQ4rS1',
  'slate-riddle': 'gH5#nV2tL8wC',
  'whisper-loop': 'Q8@rF1mP6yZ3',
  'rust-echo': 'N4!kT9vS2qG7',
  'glacier-node': 'Y7#pL3wR8mF2',
  'quasar-pylon': 'cM1@vH6zK9rQ',
  'sable-torque': 'R2!nG7pS4yL8',
  'drift-foxhole': 'V5#tQ9kM1rZ6',
  'pulse-mirror': 'fK8@rC3wN2yP',
  'ember-wicket': 'T1!pL6vG9mQ4',
  'tide-skein': 'sH4#nV7tR2kC',
  'mercury-hush': 'W9@rF2mP6yZ1',
  'basalt-grid': 'J3!kT8vS5qG2',
  'aurora-keel': 'U6#pL1wR9mF8',
  'cipher-bloom': 'hM2@vH7zK4rQ',
  'velvet-gnarl': 'E5!nG3pS8yL2',
  'ember-rail': 'O8#tQ2kM6rZ1',
  'drift-lumen': 'aK7@rC4wN9yP',
  'pixel-vale': 'I1!pL8vG3mQ6',
  'tundra-spark': 'oH9#nV2tR7kC',
  'neon-wisp': 'S4@rF8mP1yZ5',
  'prism-fjord': 'qJ2!kT6vS9qG4',
  'cobalt-crest': 'K6#pL3wR1mF9',
  'ember-glyph': 'uM5@vH2zK8rQ',
  'slate-orbit': 'D2!nG9pS4yL7',
  'rust-lattice': 'F7#tQ1kM3rZ6',
  'whisper-rail': 'pK4@rC9wN2yV',
  'nova-chassis': 'L9!pT3vG6mQ2',
  'tide-catalyst': 'zH6#nV1tR8kC',
  'drift-silo': 'X3@rF7mP2yZ9',
  'quartz-fable': 'mJ8!kT4vS1qG',
  'amber-ridge': 'N1#pL9wR6mF3',
  'pulse-bridge': 'bM4@vH8zK2rQ',
  'echo-haven': 'C2!nG5pS9yL7',
  'nebula-vault': 'Y6#tQ3kM1rZ8',
  'frost-arc': 'eK9@rC5wN2yV',
  'orbit-loom': 'T4!pL7vG3mQ9',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aprovia_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('aprovia_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const login = (username: string, password: string): boolean => {
    if (validCredentials[username] === password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('aprovia_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
