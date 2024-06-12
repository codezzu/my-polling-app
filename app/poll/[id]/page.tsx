'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

interface Poll {
  id: string;
  question: string;
}

interface Option {
  id: string;
  text: string;
}

interface Vote {
  option_id: string;
}

export default function PollDetail() {
  const params = useParams();
  const id = params?.id; // Destructure id from params
  const [poll, setPoll] = useState<Poll | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`/api/polls/${id}`);
        if (response.status === 200) {
          setPoll(response.data.poll);
          setOptions(response.data.options);
          setVotes(response.data.votes);
        } else {
          setErrorMessage('Anket bulunamadı.');
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Anket yüklenirken bir hata oluştu.');
      }
    };

    if (id) {
      fetchPoll();
    }
  }, [id]);

  const handleVote = async (optionId: string) => {
    try {
      const response = await axios.post('/api/votes', { optionId });
      if (response.status === 201) {
        setHasVoted(true);
        const updatedVotes = await axios.get(`/api/polls/${id}`);
        setVotes(updatedVotes.data.votes);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Oy verilirken bir hata oluştu.');
    }
  };

  const chartData = {
    labels: options.map((option) => option.text),
    datasets: [
      {
        label: 'Oy Sayısı',
        data: options.map(
          (option) => votes.filter((vote) => vote.option_id === option.id).length
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <div className="max-w-3xl w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {poll ? (
          <>
            <h1 className="text-2xl font-bold mb-4">{poll.question}</h1>
            <ul className="mb-4">
              {options.map((option) => (
                <li key={option.id} className="mb-2">
                  <button
                    onClick={() => handleVote(option.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={hasVoted}
                  >
                    {option.text}
                  </button>
                </li>
              ))}
            </ul>
            {hasVoted && <p className="text-green-500">Bu anket için oy kullandınız.</p>}
            <div className="mt-8">
              <Bar data={chartData} />
            </div>
          </>
        ) : (
          <p>Anket yok knk.</p>
        )}
      </div>
    </div>
  );
}
