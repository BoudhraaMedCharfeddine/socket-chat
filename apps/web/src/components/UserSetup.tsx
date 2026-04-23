import { useState } from 'react';

interface Props {
  onSubmit: (username: string) => void;
}

export default function UserSetup({ onSubmit }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <div className="flex h-full items-center justify-center bg-gray-950">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-900 p-8 rounded-2xl shadow-xl w-80"
      >
        <h1 className="text-2xl font-bold text-white text-center">Socket Chat</h1>
        <p className="text-gray-400 text-sm text-center">Entrez votre pseudo pour rejoindre</p>
        <input
          type="text"
          placeholder="Votre pseudo..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={20}
          autoFocus
          className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition"
        >
          Rejoindre
        </button>
      </form>
    </div>
  );
}
