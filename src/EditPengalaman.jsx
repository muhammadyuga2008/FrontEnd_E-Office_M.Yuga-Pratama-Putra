import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function EditPengalaman() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State form
    const [perusahaanId, setPerusahaanId] = useState('');
    const [namaProyek, setNamaProyek] = useState('');
    const [pemberiKerja, setPemberiKerja] = useState('');
    const [lokasiProyek, setLokasiProyek] = useState('');
    const [nilaiKontrak, setNilaiKontrak] = useState('');
    const [tahunPelaksanaan, setTahunPelaksanaan] = useState('');
    const [statusProyek, setStatusProyek] = useState('Selesai');

    // State list perusahaan
    const [perusahaanList, setPerusahaanList] = useState([]);

    useEffect(() => {
        const fetchPerusahaan = async () => {
            try {
                const response = await api.get('/perusahaan');
                setPerusahaanList(response.data.perusahaan || response.data.data || response.data || []);
            } catch (error) {
                console.error('Gagal mengambil daftar perusahaan', error);
            }
        };

      const fetchDetail = async () => {
    try {
        const response = await api.get(`/pp/${id}`);
        const data = response.data['pengalaman Proyek'] || response.data.pengalaman || response.data.data || response.data;
        
        setPerusahaanId(data.perusahaan_id || '');
        setNamaProyek(data.nama_proyek || '');
        setPemberiKerja(data.pemberi_kerja || '');
        setLokasiProyek(data.lokasi_proyek || '');
        setNilaiKontrak(data.nilai_kontrak || '');
        setTahunPelaksanaan(data.tahun_pelaksanaan || '');
        setStatusProyek(data.status_proyek || 'Selesai');
    } catch (error) {
        console.error('Gagal mengambil detail pengalaman proyek', error);
    }
};

        fetchPerusahaan();
        fetchDetail();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/pp/${id}`, {
                perusahaan_id: perusahaanId,
                nama_proyek: namaProyek,
                pemberi_kerja: pemberiKerja,
                lokasi_proyek: lokasiProyek,
                nilai_kontrak: Number(nilaiKontrak),
                tahun_pelaksanaan: Number(tahunPelaksanaan),
                status_proyek: statusProyek
            });
            alert('Data pengalaman proyek berhasil diperbarui!');
            navigate('/pengalaman');
        } catch (error) {
            console.error('Gagal memperbarui data:', error);
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat().join('\n');
                alert(`Gagal Validasi Data:\n${errorMessages}`);
            } else {
                alert('Gagal memperbarui data pengalaman proyek. Terjadi kesalahan server.');
            }
        }
    };

    return (
        <AdminLayout title="Edit Pengalaman Proyek">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dropdown Perusahaan */}
                    <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-2">Pilih Perusahaan</label>
                        <select
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                            value={perusahaanId}
                            onChange={(e) => setPerusahaanId(e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Perusahaan --</option>
                            {perusahaanList.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nama_perusahaan || item.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-2">Nama Proyek</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={namaProyek}
                            onChange={(e) => setNamaProyek(e.target.value)}
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-2">Pemberi Kerja / Klien</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={pemberiKerja}
                            onChange={(e) => setPemberiKerja(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Lokasi Proyek</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={lokasiProyek}
                            onChange={(e) => setLokasiProyek(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Nilai Kontrak (Rp)</label>
                        <input 
                            type="number" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={nilaiKontrak}
                            onChange={(e) => setNilaiKontrak(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Tahun Pelaksanaan</label>
                        <input 
                            type="number" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={tahunPelaksanaan}
                            onChange={(e) => setTahunPelaksanaan(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Status Proyek</label>
                        <select
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                            value={statusProyek}
                            onChange={(e) => setStatusProyek(e.target.value)}
                            required
                        >
                            <option value="Selesai">Selesai</option>
                            <option value="Progres">Progres</option>
                        </select>
                    </div>
                    
                    <div className="flex gap-4 md:col-span-2 mt-4">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition">
                            Simpan Perubahan
                        </button>
                        <button type="button" onClick={() => navigate('/pengalaman')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold transition">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}