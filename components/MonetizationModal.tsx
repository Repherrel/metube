import React from 'react';
import { CloseIcon } from './icons';
import { User } from '../types';
import { SUBSCRIPTION_PRICE } from '../constants';

interface MonetizationModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSubscribe: () => void;
}

const MonetizationModal: React.FC<MonetizationModalProps> = ({ isOpen, user, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  const handleSubscribeClick = () => {
    onSubscribe();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md p-8 relative transform transition-all" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Free Searches Limit Reached!</h2>
          {user ? (
            <>
              <p className="text-zinc-300 mb-6">
                Upgrade to MeTube Premium for unlimited translations and an ad-free experience.
              </p>
              <button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                onClick={handleSubscribeClick}
              >
                Upgrade to Premium - ${SUBSCRIPTION_PRICE}/month
              </button>
            </>
          ) : (
            <>
               <p className="text-zinc-300 mb-6">
                Please sign in with Google using the button at the top of the page to continue or subscribe for unlimited access.
              </p>
            </>
          )}
          <p className="text-xs text-zinc-500 mt-4">
            (This is a demo. Your account won't be charged.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonetizationModal;