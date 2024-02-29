import { getCurrentUser } from '@/lib/appwrite/api';
import { IUser } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
}

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isAuthenticated: false,
  isLoading: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate()

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser()
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        })
        setIsAuthenticated(true)
        return true
      }

    } catch (error) {
      console.log(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }
  // localStorage.getItem('cookieFallback') === null
  // useEffect is a hook that runs after the component is rendered
  // to use this the page everytime reload we need to use useEffect
  useEffect(() => {
    if(localStorage.getItem('cookieFallback') === '[]') {
      navigate('/sign-in')
    }

    checkAuthUser()
  }, [])
  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    checkAuthUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext)