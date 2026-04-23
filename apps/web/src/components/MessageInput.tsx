import { useState } from 'react';

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-800 bg-gray-900 flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Envoyer un message… (Entrée pour envoyer)"
        className="flex-1 resize-none bg-gray-800 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 disabled:opacity-40 max-h-32 overflow-y-auto"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-sm font-semibold transition shrink-0"
      >
        Envoyer
      </button>
    </form>
  );
}
