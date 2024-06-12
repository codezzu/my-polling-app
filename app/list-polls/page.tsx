'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Poll {
  id: string;
  question: string;
}

export default function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('/api/polls/${id}');
        if (response.status === 200) {
          setPolls(response.data);
        } else {
          setErrorMessage('Anketler yüklenirken bir hata oluştu.');
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Anketler yüklenirken bir hata oluştu.');
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <div className="max-w-3xl w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4">Anketler</h1>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <ul>
          {polls.map((poll) => (
            <li key={poll.id} className="mb-4">
              <Link href={`/poll/${poll.id}`} className="text-xl font-bold text-blue-500 hover:underline">
                {poll.question}
              </Link>
              <p className="text-gray-600">ID: {poll.id}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

