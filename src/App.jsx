import React, { useState, useEffect } from 'react';
import { CONFIG } from './config';
import KandidatCard from './components/KandidatCard';
import AdminPanel from './components/AdminPanel';
import VoteConfirmationModal from './components/VoteConfirmationModal';
import AdminLoginModal from './components/AdminLoginModal';

function App() {
  const [selectedKandidat, setSelectedKandidat] = useState(null);
  const [votedKandidat, setVotedKandidat] = useState(null);
  const [votes, setVotes] = useState(() => {
    const storedVotes = localStorage.getItem(CONFIG.STORAGE_KEY_VOTES);
    return storedVotes ? JSON.parse(storedVotes) : {};
  });
  const [voters, setVoters] = useState(() => {
    const storedVoters = localStorage.getItem(CONFIG.STORAGE_KEY_VOTERS);
    return storedVoters ? JSON.parse(storedVoters) : [];
  });

  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEY_VOTES, JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEY_VOTERS, JSON.stringify(voters));
  }, [voters]);

  useEffect(() => {
    const hasVoted = localStorage.getItem('hasVoted') === 'true';
    if (hasVoted) {
      const votedCandidateId = localStorage.getItem('votedCandidateId');
      if (votedCandidateId) {
        const kandidat = CONFIG.KANDIDAT_DATA.find(k => k.id === parseInt(votedCandidateId));
        if (kandidat) {
          setVotedKandidat(kandidat);
        }
      }
    }
  }, []);

  const handleKandidatSelect = (kandidat) => {
    const hasVoted = localStorage.getItem('hasVoted') === 'true';
    if (hasVoted) {
      alert('Anda sudah melakukan voting sebelumnya.');
      return;
    }
    setSelectedKandidat(kandidat);
    setIsVoteModalOpen(true);
  };

  const confirmVote = () => {
    if (selectedKandidat) {
      const voterData = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        kandidatId: selectedKandidat.id,
        kandidatNama: selectedKandidat.nama,
        waktuVoting: new Date().toLocaleString()
      };

      setVotedKandidat(selectedKandidat);
      setVotes(prev => ({
        ...prev,
        [selectedKandidat.id]: (prev[selectedKandidat.id] || 0) + 1
      }));
      
      setVoters(prev => [...prev, voterData]);
      
      localStorage.setItem('hasVoted', 'true');
      localStorage.setItem('votedCandidateId', selectedKandidat.id.toString());
      
      setIsVoteModalOpen(false);
    }
  };

  const resetVoting = () => {
    localStorage.removeItem('hasVoted');
    localStorage.removeItem('votedCandidateId');
    localStorage.removeItem(CONFIG.STORAGE_KEY_VOTES);
    localStorage.removeItem(CONFIG.STORAGE_KEY_VOTERS);
    
    setVotedKandidat(null);
    setVotes({});
    setVoters([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAdminLoggedIn ? (
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Pemilihan Ketua Umum
          </h1>
          <div className="grid md:grid-cols-3 gap-6">
            {CONFIG.KANDIDAT_DATA.map((kandidat) => (
              <KandidatCard
                key={kandidat.id}
                kandidat={kandidat}
                onSelect={handleKandidatSelect}
                disabled={votedKandidat !== null}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Login Admin
            </button>
          </div>
          <VoteConfirmationModal
            isOpen={isVoteModalOpen}
            kandidat={selectedKandidat}
            onConfirm={confirmVote}
            onClose={() => setIsVoteModalOpen(false)}
          />
          <AdminLoginModal
            isOpen={isAdminLoginModalOpen}
            onClose={() => setIsAdminLoginModalOpen(false)}
            onLogin={() => setIsAdminLoggedIn(true)}
          />
        </div>
      ) : (
        <AdminPanel
          votes={votes}
          voters={voters}
          onReset={resetVoting}
          onLogout={() => setIsAdminLoggedIn(false)}
        />
      )}
    </div>
  );
}

export default App;