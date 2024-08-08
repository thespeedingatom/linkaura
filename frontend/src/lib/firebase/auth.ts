import { auth } from './config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';

export const signIn = async (email: string, password: string): Promise => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signUp = async (email: string, password: string): Promise => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = async (): Promise => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const getIdToken = async (): Promise => {
  const user = getCurrentUser();
  if (user) {
    return await user.getIdToken();
  }
  return null;
};