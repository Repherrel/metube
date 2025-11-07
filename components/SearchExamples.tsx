import React from 'react';

interface SearchExamplesProps {
  onExampleClick: (query: string) => void;
}

const examples = [
  { lang: 'Spanish', query: 'canciones de rock en español' },
  { lang: 'Hindi', query: 'बॉलीवुड नई फिल्म ट्रेलर' },
  { lang: 'Japanese', query: '面白い猫の動画' },
  { lang: 'Arabic', query: 'كيفية طبخ الكبسة' },
  { lang: 'French', query: 'recettes de croissants faciles' },
];

const SearchExamples: React.FC<SearchExamplesProps> = ({ onExampleClick }) => {
  return (
    <div className="mt-8">
      <h3 className="text-zinc-500 text-sm font-semibold">Try an example:</h3>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {examples.map((example) => (
          <button
            key={example.lang}
            onClick={() => onExampleClick(example.query)}
            className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-full text-sm hover:bg-zinc-700 hover:text-white transition-colors"
          >
            {example.query}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchExamples;
