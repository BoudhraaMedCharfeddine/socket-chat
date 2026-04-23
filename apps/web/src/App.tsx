import { useState } from 'react';
import UserSetup from './components/UserSetup';
import Chat from './components/Chat';

export default function App() {
  const [username, setUsername] = useState<string | null>(null);

  if (!username) {
    return <UserSetup onSubmit={setUsername} />;
  }

  return <Chat username={username} />;
}
