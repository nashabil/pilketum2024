import React from 'react';
import { CONFIG } from '../config';

function AdminPanel({ votes, voters, onReset, onLogout }) {
  const calculateTotalVotes = () => 
    Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Panel Administrator</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Rekap Voting</h2>
        {CONFIG.KANDIDAT_DATA.map((kandidat) => {
          const totalSuara = calculateTotalVotes();
          const suaraKandidat = votes[kandidat.id] || 0;
          const persentase = totalSuara > 0 
            ? ((suaraKandidat / totalSuara) * 100).toFixed(2) 
            : '0.00';
          
          return (
            <div key={kandidat.id} className="mb-2">
              <div className="flex justify-between">
                <span>{kandidat.nama}</span>
                <span>{suaraKandidat} suara ({persentase}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Daftar Pemilih</h2>
        {voters.map((voter, index) => (
          <div key={index} className="border-b py-2">
            <div className="flex justify-between">
              <span>{voter.kandidatNama}</span>
              <span>{voter.waktuVoting}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex space-x-4">
        <button 
          onClick={onReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset Voting
        </button>
        <button 
          onClick={onLogout}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;