'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!username) {
      setErrorMessage('Kullanıcı adı zorunludur.');
      return;
    }

    try {
      const response = await axios.post('/api/register', { username });
      if (response.status === 201) {
        // Kullanıcı adı başarıyla kaydedildi, oturuma ekle
        document.cookie = `username=${username}; path=/`;
        // Anket listesine yönlendirin
        router.push('/list-polls');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Kayıt işlemi sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <div className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4">Kullanıcı Adı Belirleyin</h1>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          onClick={handleRegister}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
}
