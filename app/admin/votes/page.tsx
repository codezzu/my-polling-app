'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminVotes() {
  const [votes, setVotes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get('/api/admin/votes');
        setVotes(response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage('Oylar yüklenirken bir hata oluştu.');
      }
    };

    fetchVotes();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <div className="max-w-4xl w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Oylar</h1>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <table className="min-w-full bg-white text-black">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">Kullanıcı Adı</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">IP Adresi</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">Oy Verilen Seçenek</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">Anket Sorusu</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">Oy Verilme Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-200 text-gray-800">{vote.username}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-gray-800">{vote.ip_address}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-gray-800">{vote.option_text}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-gray-800">{vote.poll_question}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-gray-800">{new Date(vote.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
