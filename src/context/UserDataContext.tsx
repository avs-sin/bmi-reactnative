import React, { createContext, useContext, ReactNode } from 'react';
import { useUserData, WeightHistory } from '../utils/DataStore';

// Define the context shape
interface UserDataContextType {
  isMetric: boolean;
  setIsMetric: (value: boolean) => void;
  weight: number;
  setWeight: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  startWeight: number;
  setStartWeight: (value: number) => void;
  targetWeight: number;
  setTargetWeight: (value: number) => void;
  weightHistory: WeightHistory[];
  addWeightEntry: (weight: number) => Promise<void>;
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
}

// Create the context
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Create the provider component
interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  // Use the data hook to manage state
  const userData = useUserData();
  
  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

// Create a custom hook for using the context
export const useUserDataContext = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  
  if (context === undefined) {
    throw new Error('useUserDataContext must be used within a UserDataProvider');
  }
  
  return context;
};

// Export a higher-order component to wrap components that need user data
export const withUserData = <P extends object>(
  Component: React.ComponentType<P & UserDataContextType>
) => {
  const WithUserData: React.FC<P> = (props) => {
    const userData = useUserDataContext();
    return <Component {...props} {...userData} />;
  };
  
  return WithUserData;
}; 