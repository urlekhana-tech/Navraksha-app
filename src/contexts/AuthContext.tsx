import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaptainProfile } from '../types';

interface AuthContextType {
  captain: CaptainProfile;
  isAuthenticated: boolean;
  login: (phone: string, boatRegNo: string, captainName?: string, basePort?: string) => void;
  logout: () => void;
  updateCaptain: (data: Partial<CaptainProfile>) => void;
}

const DEFAULT_CAPTAIN: CaptainProfile = {
  id: 'cpt-ka-9021',
  name: 'Captain Basheer Ahmed',
  phone: '+91 98451 23456',
  boatName: 'Sagar Ratna (सागर रत्न)',
  boatRegNo: 'IND-KA-02-MM-4491',
  licenseNo: 'DG-SHIPPING-KA-88321',
  basePort: 'Mangalore Panambur / Old Port',
  state: 'Karnataka',
  role: 'fisherman',
  issuedDate: '12 Apr 2024',
  expiryDate: '11 Apr 2029',
  avatarUrl: '/src/assets/images/fisherman_captain_avatar_1792679776725.jpg',
  emergencyContactName: 'Coast Guard Stn & Imran Ahmed (Brother)',
  emergencyContactPhone: '+91 94481 99887',
  isAuthenticated: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [captain, setCaptain] = useState<CaptainProfile>(() => {
    try {
      const saved = localStorage.getItem('navraksha_captain');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved captain profile', e);
    }
    return DEFAULT_CAPTAIN;
  });

  useEffect(() => {
    try {
      localStorage.setItem('navraksha_captain', JSON.stringify(captain));
    } catch (e) {
      console.error('Error saving captain profile to local storage', e);
    }
  }, [captain]);

  const login = (phone: string, boatRegNo: string, captainName?: string, basePort?: string) => {
    setCaptain((prev) => ({
      ...prev,
      phone,
      boatRegNo,
      name: captainName || prev.name,
      basePort: basePort || prev.basePort,
      isAuthenticated: true,
    }));
  };

  const logout = () => {
    setCaptain((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  const updateCaptain = (data: Partial<CaptainProfile>) => {
    setCaptain((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        captain,
        isAuthenticated: captain.isAuthenticated,
        login,
        logout,
        updateCaptain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
