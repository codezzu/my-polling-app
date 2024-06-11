'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const response = await axios.post('/api/polls', { question, options });
      setSuccessMessage(`Anket başarıyla oluşturuldu: ID ${response.data.pollId}`);
      setQuestion('');
      setOptions(['', '']);
    } catch (error) {
      console.error(error);
      setErrorMessage('Anket oluşturulurken bir hata oluştu.');
    }
  };

  const addOption = () => setOptions([...options, '']);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <div className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4">Anket Oluştur</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Soru
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seçenekler
            </label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            ))}
            <button
              type="button"
              onClick={addOption}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Seçenek Ekle
            </button>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Anket Oluştur
          </button>
        </form>
        {successMessage && (
          <p className="mt-4 text-green-500 text-sm">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-500 text-sm">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
