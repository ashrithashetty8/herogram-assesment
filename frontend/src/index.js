// Frontend React App for AI Image Generator
// TailwindCSS + Socket.IO + Upload Support + Realtime Updates

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3003'); // Update if deployed

export default function App() {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [count, setCount] = useState(1);
  const [paintings, setPaintings] = useState([]);
  const [activeTitle, setActiveTitle] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [useGlobalRef, setUseGlobalRef] = useState(true);

  const fileInputRef = useRef();

  useEffect(() => {
    socket.on('status', ({ id, status }) => {
      setPaintings((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    });

    socket.on('done', ({ id, imageUrl }) => {
      setPaintings((prev) =>
        prev.map((p) => (p.id === id ? { ...p, imageUrl, status: 'done' } : p))
      );
    });

    socket.on('error', ({ id, message }) => {
      setPaintings((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'failed', error: message } : p))
      );
    });

    return () => {
      socket.off('status');
      socket.off('done');
      socket.off('error');
    };
  }, []);

  const handleGenerate = async () => {
    const newPaintings = Array.from({ length: count }, (_, idx) => ({
      id: Date.now() + idx,
      status: 'pending'
    }));
    setPaintings(newPaintings);
    setActiveTitle(title);

    socket.emit('generate-paintings', {
      title,
      instructions,
      count,
      referenceImage
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setReferenceImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegenerate = (painting) => {
    socket.emit('generate-paintings', {
      title,
      instructions,
      count: 1,
      referenceImage
    });
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h2 className="text-xl font-bold">aj3a.com</h2>
        <ul>
          {activeTitle && <li className="mt-4 bg-slate-700 rounded px-2 py-1">{activeTitle}</li>}
        </ul>
      </aside>

      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>

        <div className="bg-white p-4 rounded shadow mb-4">
          <label className="block font-semibold mb-2">Reference Images</label>
          <div className="flex items-center mb-2">
            <label className="mr-2">Use global references</label>
            <input
              type="checkbox"
              checked={useGlobalRef}
              onChange={() => setUseGlobalRef(!useGlobalRef)}
            />
          </div>
          <div className="border p-4 text-center bg-gray-50 rounded">
            <p className="mb-2">Drop reference images here or</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              className="bg-gray-300 px-4 py-1 rounded"
              onClick={() => fileInputRef.current.click()}
            >
              Upload
            </button>
            {!referenceImage && <p className="text-sm text-gray-500 mt-2">No reference images uploaded</p>}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6">
          <label className="block font-semibold">Title:</label>
          <input
            className="w-full border p-2 rounded mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="block font-semibold">Custom Instructions:</label>
          <textarea
            className="w-full border p-2 rounded mb-2"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <label className="block font-semibold">Number of Paintings:</label>
          <input
            type="number"
            className="w-24 border p-2 rounded mb-4"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={handleGenerate}
          >
            Generate Paintings
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Generated Paintings</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paintings.map((p, i) => (
              <div key={i} className="bg-white rounded shadow p-2">
                {p.status === 'done' && (
                  <img src={p.imageUrl} alt="generated" className="w-full h-48 object-cover rounded" />
                )}
                {p.status !== 'done' && (
                  <div className="h-48 flex items-center justify-center text-sm text-gray-500">
                    {p.status}
                  </div>
                )}
                <div className="mt-2 flex justify-between">
                  <button
                    className="bg-gray-300 px-2 py-1 rounded text-sm"
                    onClick={() => handleRegenerate(p)}
                  >
                    Regenerate
                  </button>
                  {p.imageUrl && (
                    <a
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      href={p.imageUrl}
                      download
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
