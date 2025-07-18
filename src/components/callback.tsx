import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const [message, setMessage] = useState('Processing Discord authentication...');

  useEffect(() => {
    if (!code) return;

    const authenticate = async () => {
      try {
        const res = await fetch('/api/discord-auth.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        if (data.success) {
          setMessage(`Welcome, ${data.user.username}#${data.user.discriminator}`);
        } else {
          setMessage('Authentication failed.');
        }
      } catch (err) {
        setMessage('Error while authenticating.');
      }
    };

    authenticate();
  }, [code]);

  return <div className="text-center p-8 text-xl">{message}</div>;
}
