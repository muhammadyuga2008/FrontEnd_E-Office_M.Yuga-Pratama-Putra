import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function TambahPerusahaan() {
    const navigate = useNavigate();
    
    // State disesuaikan dengan 8 field yang wajib (required) di controller
    const [namaPerusahaan, setNamaPerusahaan] = useState('');
    const [alamat, setAlamat] = useState('');
    const [npwp, setNpwp] = useState('');
    const [nib, setNib] = useState('');
    const [namaDirektur, setNamaDirektur] = useState('');
    const [jabatanDirektur, setJabatanDirektur] = useState('');
    const [noTelepon, setNoTelepon] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Mengubah endpoint menjadi /postperusahaan sesuai file api.php
            await api.post('/postperusahaan', {
                nama_perusahaan: namaPerusahaan,
                alamat: alamat,
                npwp: npwp,
                nib: nib,
                nama_direktur: namaDirektur,
                jabatan_direktur: jabatanDirektur,
                no_telepon: noTelepon, // Disesuaikan dengan controller yang meminta no_telepon
                email: email
            });
            
            alert('Data berhasil ditambahkan!');
            navigate('/perusahaan'); 
        } catch (error) {
            console.error('Gagal menambah data', error);
            // Tambahan opsional: Menampilkan pesan error dari validasi backend jika ada
            if(error.response && error.response.data.errors) {
                alert(Object.values(error.response.data.errors).flat().join('\n'));
            } else {
                alert('Terjadi kesalahan saat menyimpan data.');
            }
        }
    };

    return (
        <AdminLayout title="Tambah Data Perusahaan">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-2">Nama Perusahaan</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={namaPerusahaan}
                            onChange={(e) => setNamaPerusahaan(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">NPWP</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={npwp}
                            onChange={(e) => setNpwp(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">NIB</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={nib}
                            onChange={(e) => setNib(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Nama Direktur</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={namaDirektur}
                            onChange={(e) => setNamaDirektur(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Jabatan Direktur</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={jabatanDirektur}
                            onChange={(e) => setJabatanDirektur(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">No. Telepon</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={noTelepon}
                            onChange={(e) => setNoTelepon(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Email</label>
                        <input 
                            type="email" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-2">Alamat Lengkap</label>
                        <textarea 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            rows="3"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex gap-4 md:col-span-2 mt-4">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition">
                            Simpan Data
                        </button>
                        <button type="button" onClick={() => navigate('/perusahaan')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold transition">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}