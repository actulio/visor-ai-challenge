import { FC, ReactNode, createContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { User } from '../interfaces/user';
import { checkAuth } from '../utils/checkAuth';

export const AppContext = createContext(
  {} as {
    userData: User;
    storeUserData: Dispatch<SetStateAction<User>>;
    clearUserData: () => void;
  }
);

const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User>({ id: '', name: '', email: '' });

  const clearUserData = () => {
    setUserData({ id: '', name: '', email: '' });
  };

  useEffect(() => {
    const user = checkAuth();
    if (user) setUserData({ id: user.user_id, name: user.name, email: user.email });
  }, []);

  return (
    <AppContext.Provider
      value={{
        userData,
        storeUserData: setUserData,
        clearUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
