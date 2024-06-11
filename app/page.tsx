import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <div className="max-w-3xl w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4">Anket Uygulaması</h1>
        <div className="flex flex-col space-y-4">
          <Link href="/create-poll">
            <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
              Anket Oluştur
            </span>
          </Link>
          <Link href="/list-polls">
            <span className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
              Anketleri Görüntüle
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
