
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => (
  <div className="flex flex-col justify-center items-center py-10 gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    {message && <p className="text-zinc-400 animate-pulse">{message}</p>}
  </div>
);

export default Loader;
