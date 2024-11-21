// Configuration
const CONFIG = {
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin123',
  STORAGE_KEY_VOTES: 'voting_app_votes',
  STORAGE_KEY_VOTERS: 'voting_app_voters',
  KANDIDAT_DATA: [
    {
      id: 1,
      nama: "Ahmad Susanto",
      umur: 45,
      pengalaman: "Mantan Ketua Organisasi Pemuda",
      visi: "Membangun Generasi Muda yang Produktif dan Inovatif",
      foto: "https://via.placeholder.com/200"
    },
    {
      id: 2,
      nama: "Siti Rahayu",
      umur: 38,
      pengalaman: "Aktivis Sosial dan Pengusaha Muda",
      visi: "Pengembangan Ekonomi Kreatif dan Kesejahteraan Masyarakat",
      foto: "https://via.placeholder.com/200"
    },
    {
      id: 3,
      nama: "Budi Prasetyo",
      umur: 52,
      pengalaman: "Pemimpin Lembaga Swadaya Masyarakat",
      visi: "Transformasi Digital dan Pemberdayaan Komunitas",
      foto: "https://via.placeholder.com/200"
    }
  ]
};

// Main Voting App Component
function VotingApp() {
  // State Hooks
  const [selectedKandidat, setSelectedKandidat] = React.useState(null);
  const [votedKandidat, setVotedKandidat] = React.useState(null);
  const [votes, setVotes] = React.useState(() => {
    const storedVotes = localStorage.getItem(CONFIG.STORAGE_KEY_VOTES);
    return storedVotes ? JSON.parse(storedVotes) : {};
  });
  const [voters, setVoters] = React.useState(() => {
    const storedVoters = localStorage.getItem(CONFIG.STORAGE_KEY_VOTERS);
    return storedVoters ? JSON.parse(storedVoters) : [];
  });

  // Modal and Authentication States
  const [isVoteModalOpen, setIsVoteModalOpen] = React.useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = React.useState(false);
  const [adminUsername, setAdminUsername] = React.useState('');
  const [adminPassword, setAdminPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');

  // Save votes to localStorage
  React.useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEY_VOTES, JSON.stringify(votes));
  }, [votes]);

  // Save voters to localStorage
  React.useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEY_VOTERS, JSON.stringify(voters));
  }, [voters]);

  // Prevent duplicate voting
  React.useEffect(() => {
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

  // Kandidat Selection Handler
  const handleKandidatSelect = (kandidat) => {
    const hasVoted = localStorage.getItem('hasVoted') === 'true';
    if (hasVoted) {
      alert('Anda sudah melakukan voting sebelumnya.');
      return;
    }

    setSelectedKandidat(kandidat);
    setIsVoteModalOpen(true);
  };

  // Confirm Vote Handler
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

  // Admin Login Handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const trimmedUsername = adminUsername.trim();
    const trimmedPassword = adminPassword.trim();

    if (
      trimmedUsername === CONFIG.ADMIN_USERNAME && 
      trimmedPassword === CONFIG.ADMIN_PASSWORD
    ) {
      setIsAdminLoggedIn(true);
      setIsAdminLoginModalOpen(false);
      setLoginError('');
    } else {
      setLoginError('Username atau password salah');
    }
  };

  // Reset Voting Handler
  const resetVoting = () => {
    localStorage.removeItem('hasVoted');
    localStorage.removeItem('votedCandidateId');
    localStorage.removeItem(CONFIG.STORAGE_KEY_VOTES);
    localStorage.removeItem(CONFIG.STORAGE_KEY_VOTERS);
    
    setVotedKandidat(null);
    setVotes({});
    setVoters([]);
  };

  // Kandidat Cards Rendering
  const renderKandidatCards = () => {
    return CONFIG.KANDIDAT_DATA.map((kandidat) => (
      <div key={kandidat.id} className="bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src={kandidat.foto} 
          alt={kandidat.nama} 
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{kandidat.nama}</h2>
          <p>Umur: {kandidat.umur} tahun</p>
          <p>Pengalaman: {kandidat.pengalaman}</p>
          <p className="italic mt-2">"{kandidat.visi}"</p>
          <button 
            onClick={() => handleKandidatSelect(kandidat)}
            disabled={votedKandidat !== null}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded 
              hover:bg-blue-600 disabled:opacity-50"
          >
            {votedKandidat ? "Sudah Memilih" : "Pilih Kandidat"}
          </button>
        </div>
      </div>
    ));
  };

  // Admin Panel Rendering
  const renderAdminPanel = () => {
    const calculateTotalVotes = () => 
      Object.values(votes).reduce((a, b) => a + b, 0);

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Panel Administrator</h1>
        
        {/* Voting Rekap */}
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

        {/* Voters List */}
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
            onClick={resetVoting}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Voting
          </button>
          <button 
            onClick={() => setIsAdminLoggedIn(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  };

  // Admin Login Modal
  const renderAdminLoginModal = () => {
    if (!isAdminLoginModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-4">Login Admin</h2>
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label className="block mb-2">Username</label>
              <input 
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input 
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-500 mb-4">{loginError}</p>
            )}
            <div className="flex justify-between">
              <button 
                type="button"
                onClick={() => setIsAdminLoginModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Vote Confirmation Modal
  const renderVoteConfirmationModal = () => {
    if (!isVoteModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-4">Konfirmasi Pemilihan</h2>
          <p className="mb-4">
            Apakah Anda yakin ingin memilih {selectedKandidat.nama}?
          </p>
          <div className="flex justify-between">
            <button 
              onClick={() => setIsVoteModalOpen(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Batal
            </button>
            <button 
              onClick={confirmVote}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Ya, Saya Yakin
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="min-h-screen bg-gray-100">
      {!isAdminLoggedIn ? (
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Pemilihan Ketua Umum
          </h1>
          <div className="grid md:grid-cols-3 gap-6">
            {renderKandidatCards()}
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Login Admin
            </button>
          </div>
          {renderVoteConfirmationModal()}
          {renderAdminLoginModal()}
        </div>
      ) : (
        renderAdminPanel()
      )}
    </div>
  );
}

// Render the app
ReactDOM.render(
  <React.StrictMode>
    <VotingApp />
  </React.StrictMode>,
  document.getElementById('root')
);