import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function EditPersonel() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State form
    const [perusahaanId, setPerusahaanId] = useState('');
    const [namaPersonel, setNamaPersonel] = useState('');
    const [jabatan, setJabatan] = useState('');
    const [pendidikan, setPendidikan] = useState('');
    const [sertifikasi, setSertifikasi] = useState('');
    const [nomorSertifikat, setNomorSertifikat] = useState('');
    const [pengalamanKerja, setPengalamanKerja] = useState('');

    // State list perusahaan
    const [perusahaanList, setPerusahaanList] = useState([]);

    useEffect(() => {
        // 1. Fetch daftar perusahaan untuk dropdown
        const fetchPerusahaan = async () => {
            try {
                const response = await api.get('/perusahaan');
                setPerusahaanList(response.data.perusahaan || response.data.data || response.data || []);
            } catch (error) {
                console.error('Gagal mengambil daftar perusahaan', error);
            }
        };

        // 2. Fetch detail personel berdasarkan ID
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/personel/${id}`);
                const data = response.data.personel || response.data.data || response.data;
                setPerusahaanId(data.perusahaan_id || '');
                setNamaPersonel(data.nama_personel || '');
                setJabatan(data.jabatan || '');
                setPendidikan(data.pendidikan || '');
                setSertifikasi(data.sertifikasi || '');
                setNomorSertifikat(data.nomor_sertifikat || '');
                setPengalamanKerja(data.pengalaman_kerja || '');
            } catch (error) {
                console.error('Gagal mengambil detail personel', error);
            }
        };

        fetchPerusahaan();
        fetchDetail();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/personel/${id}`, {
                perusahaan_id: perusahaanId, // Mengirimkan ID Perusahaan
                nama_personel: namaPersonel,
                jabatan: jabatan,
                pendidikan: pendidikan,
                sertifikasi: sertifikasi,
                nomor_sertifikat: nomorSertifikat,
                pengalaman_kerja: Number(pengalamanKerja)
            });
            alert('Data personel berhasil diperbarui!');
            navigate('/personel');
        } catch (error) {
            console.error('Gagal memperbarui data:', error);
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat().join('\n');
                alert(`Gagal Validasi Data:\n${errorMessages}`);
            } else {
                alert('Gagal memperbarui data personel. Terjadi kesalahan server.');
            }
        }
    };

    return (
        <AdminLayout title="Edit Tenaga Ahli">
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
                        <label className="block text-slate-700 font-medium mb-2">Nama Lengkap Personel</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={namaPersonel}
                            onChange={(e) => setNamaPersonel(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Jabatan / Posisi</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={jabatan}
                            onChange={(e) => setJabatan(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Pendidikan Terakhir</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={pendidikan}
                            onChange={(e) => setPendidikan(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">Sertifikasi / Keahlian</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={sertifikasi}
                            onChange={(e) => setSertifikasi(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-medium mb-2">No. Sertifikat</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={nomorSertifikat}
                            onChange={(e) => setNomorSertifikat(e.target.value)}
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-2">Pengalaman Kerja (Tahun)</label>
                        <input 
                            type="number" 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={pengalamanKerja}
                            onChange={(e) => setPengalamanKerja(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="flex gap-4 md:col-span-2 mt-4">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition">
                            Simpan Perubahan
                        </button>
                        <button type="button" onClick={() => navigate('/personel')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold transition">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}