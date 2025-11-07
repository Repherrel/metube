
import React from 'react';
import { User } from '../types';
import { SUBSCRIPTION_PRICE } from '../constants';

interface ProfileDropdownProps {
  user: User;
  isSubscribed: boolean;
  onSignOut: () => void;
  onSubscribe: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, isSubscribed, onSignOut, onSubscribe }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-white truncate">{user.name}</p>
            <p className="text-sm text-zinc-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="p-2">
        {isSubscribed ? (
          <div className="px-3 py-2 text-center text-green-400">
            <p className="font-semibold">Subscribed!</p>
            <p className="text-xs text-zinc-400">You have unlimited searches.</p>
          </div>
        ) : (
          <button
            onClick={onSubscribe}
            className="w-full text-left px-3 py-2 text-white hover:bg-red-600 rounded-md transition-colors"
          >
            Subscribe Now for ${SUBSCRIPTION_PRICE}/mo
          </button>
        )}
        <button
          onClick={onSignOut}
          className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-zinc-700 rounded-md transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
