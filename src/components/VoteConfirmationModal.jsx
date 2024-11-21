import React from 'react';

function VoteConfirmationModal({ isOpen, kandidat, onConfirm, onClose }) {
  if (!isOpen || !kandidat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Konfirmasi Pemilihan</h2>
        <p className="mb-4">
          Apakah Anda yakin ingin memilih {kandidat.nama}?
        </p>
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ya, Saya Yakin
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoteConfirmationModal;