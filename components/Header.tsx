import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, MeTubeLogoIcon, GoogleIcon, MicrophoneIcon } from './icons';
import { FREE_SEARCH_LIMIT } from '../constants';
import { User } from '../types';
import ProfileDropdown from './ProfileDropdown';
import * as authService from '../services/authService';

// FIX: Add types for the Web Speech API to resolve "Cannot find name 'SpeechRecognition'" error.
interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}


// Extend window type for prefixed SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface HeaderProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  loading: boolean;
  searchCount: number;
  user: User | null;
  isSubscribed: boolean;
  onSignOut: () => void;
  onSubscribe: () => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  query,
  setQuery,
  onSearch, 
  loading, 
  searchCount, 
  user, 
  isSubscribed, 
  onSignOut,
  onSubscribe,
  onGoHome
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const googleSignInButtonRef = useRef<HTMLDivElement>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  const handleVoiceSearchClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported by your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US'; // Can be any language, Gemini will translate
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setQuery('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      formRef.current?.requestSubmit();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
       if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert("Microphone permission denied. Please enable it in your browser settings to use voice search.");
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user && googleSignInButtonRef.current) {
        authService.renderGoogleButton(googleSignInButtonRef.current);
    }
  }, [user]);
  
  const searchesLeft = FREE_SEARCH_LIMIT - searchCount;

  return (
    <header className="bg-zinc-900/80 backdrop-blur-md sticky top-0 z-20 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <button onClick={onGoHome} className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-red-500 rounded-lg p-1 -ml-1">
          <MeTubeLogoIcon className="h-8 w-auto" />
          <h1 className="text-2xl font-bold tracking-tighter">MeTube</h1>
        </button>
        <div className="flex-1 flex justify-center px-4">
          <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isListening ? "Listening..." : "Search in any language..."}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-2 pl-4 pr-24 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                 <button
                    type="button"
                    onClick={handleVoiceSearchClick}
                    className="flex items-center justify-center w-12 h-full text-zinc-400 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed"
                    disabled={loading}
                 >
                    <MicrophoneIcon className={`w-5 h-5 transition-colors ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                 </button>
                 <button
                    type="submit"
                    className="flex items-center justify-center w-12 h-full text-zinc-400 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed border-l border-zinc-700"
                    disabled={loading || !query.trim()}
                 >
                    <SearchIcon className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </form>
        </div>
        <div className="flex items-center gap-4">
          {!isSubscribed && (
            <div className="text-sm text-zinc-400 hidden md:block">
              <span className="font-semibold text-white">{searchesLeft > 0 ? searchesLeft : 0}</span> free searches left
            </div>
          )}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(prev => !prev)} className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-red-500">
                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              </button>
              {isDropdownOpen && <ProfileDropdown user={user} isSubscribed={isSubscribed} onSignOut={onSignOut} onSubscribe={onSubscribe} />}
            </div>
          ) : (
            <div ref={googleSignInButtonRef} className="flex items-center"></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;