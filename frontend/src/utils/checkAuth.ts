import { User } from '../interfaces/user';
import { jwt } from './jwt';
import { getLocalStorage } from './storage';

export const checkAuth = () => {
  const decodedToken = jwt<Omit<User, 'id'> & { user_id: string; exp: number }>(
    getLocalStorage('token')
  );

  if (
    !decodedToken ||
    !decodedToken.user_id ||
    !decodedToken.email ||
    !decodedToken.name ||
    !decodedToken.exp ||
    new Date() > new Date(decodedToken.exp * 1000)
  ) {
    return null;
  } else {
    return decodedToken;
  }
};
