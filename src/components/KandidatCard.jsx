import React from 'react';

function KandidatCard({ kandidat, onSelect, disabled }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
          onClick={() => onSelect(kandidat)}
          disabled={disabled}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded 
            hover:bg-blue-600 disabled:opacity-50"
        >
          {disabled ? "Sudah Memilih" : "Pilih Kandidat"}
        </button>
      </div>
    </div>
  );
}

export default KandidatCard;