// src/components/Callback.tsx

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      axios
        .post('/api/discord-auth', { code })
        .then((res) => {
          console.log('✅ Auth successful:', res.data);

          // Redirect or show success
          navigate('/');
        })
        .catch((err) => {
          console.error('❌ Auth failed:', err);
        });
    }
  }, [location, navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-semibold">Processing your Discord login...</h1>
    </div>
  );
};

export default Callback;
