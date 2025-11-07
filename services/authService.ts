import { User } from '../types';
import { GOOGLE_CLIENT_ID } from '../constants';

const USER_KEY = 'metube_user';
const SUB_KEY = 'metube_subscription';

// Extend window type for Google Identity Services
declare global {
  interface Window {
    google: any;
  }
}

// --- JWT Decoding Utility ---
const decodeJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
};

// --- Event Listener System ---
const listeners = new Set<(user: User | null) => void>();

const notifyListeners = () => {
  const user = getCurrentUser();
  listeners.forEach(listener => listener(user));
};


// --- Core Authentication Functions ---
const handleCredentialResponse = (response: any) => {
  const decodedToken = decodeJwt(response.credential);
  if (!decodedToken) {
    console.error("Invalid token received");
    return;
  }
  
  const user: User = {
    name: decodedToken.name,
    email: decodedToken.email,
    picture: decodedToken.picture,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyListeners();
};

export const initGoogleSignIn = () => {
  if (typeof window.google === 'undefined' || typeof window.google.accounts === 'undefined') {
    // Retry if GSI script hasn't loaded yet
    setTimeout(initGoogleSignIn, 100);
    return;
  }
  
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse
  });
};

export const renderGoogleButton = (element: HTMLElement) => {
    if (typeof window.google === 'undefined' || typeof window.google.accounts === 'undefined') {
        return;
    }
    window.google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'pill',
      text: 'signin_with',
      logo_alignment: 'left',
    });
}


export const signOut = () => {
  if (getCurrentUser()) {
     window.google.accounts.id.disableAutoSelect();
  }
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SUB_KEY);
  notifyListeners();
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  listeners.add(callback);
  callback(getCurrentUser());
  
  return () => {
    listeners.delete(callback);
  };
};

export const subscribe = () => {
  if (getCurrentUser()) {
    localStorage.setItem(SUB_KEY, 'true');
    notifyListeners();
  }
};

export const isSubscribed = (): boolean => {
  return !!localStorage.getItem(SUB_KEY);
};