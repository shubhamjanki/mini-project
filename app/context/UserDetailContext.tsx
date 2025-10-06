"use client"
import React, { createContext } from 'react';

type UserDetailContextType = {
  userDetail: any;
  setUserDetail: React.Dispatch<React.SetStateAction<any>>;
};

export const UserDetailContext = createContext<UserDetailContextType>({
  userDetail: null,
  setUserDetail: () => {},
});