import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function DataPersonel() {
    const [personelList, setPersonelList] = useState([]);
    const [perusahaanList, setPerusahaanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            // Mengambil data personel dan daftar perusahaan secara bersamaan
            const [resPersonel, resPerusahaan] = await Promise.all([
                api.get('/personel'),
                api.get('/perusahaan').catch(() => ({ data: [] }))
            ]);

            const dataPersonel = resPersonel.data.personel || resPersonel.data.data || resPersonel.data || [];
            const dataPerusahaan = resPerusahaan.data.perusahaan || resPerusahaan.data.data || resPerusahaan.data || [];

            setPersonelList(Array.isArray(dataPersonel) ? dataPersonel : []);
            setPerusahaanList(Array.isArray(dataPerusahaan) ? dataPerusahaan : []);
        } catch (error) {
            console.error('Gagal mengambil data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fungsi untuk Mencari Nama Perusahaan Berdasarkan perusahaan_id
    const getNamaPerusahaan = (perusahaanId) => {
        if (!perusahaanId) return '-';
        const p = perusahaanList.find(item => Number(item.id) === Number(perusahaanId));
        return p ? (p.nama_perusahaan || p.nama) : '-';
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data personel ini?')) {
            try {
                await api.delete(`/deletepersonel/${id}`);
                alert('Data personel berhasil dihapus!');
                fetchData();
            } catch (error) {
                console.error('Gagal menghapus data', error);
                alert('Gagal menghapus data personel.');
            }
        }
    };

    return (
        <AdminLayout title="Data Personel / Tenaga Ahli">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-slate-800">Daftar Tenaga Ahli</h1>
                <button 
                    onClick={() => navigate('/personel/tambah')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition"
                >
                    + Tambah Personel
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Memuat data personel...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
                                <th className="p-4">No</th>
                                <th className="p-4">Nama Personel</th>
                                <th className="p-4">Nama Perusahaan</th>
                                <th className="p-4">Jabatan</th>
                                <th className="p-4">Pendidikan</th>
                                <th className="p-4">Pengalaman Kerja</th>
                                <th className="p-4">Sertifikasi</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personelList.length > 0 ? (
                                personelList.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="p-4 text-slate-500">{index + 1}</td>
                                        <td className="p-4 font-semibold text-slate-800">{item.nama_personel}</td>
                                        <td className="p-4 font-medium text-slate-700">
                                            {item.perusahaan?.nama_perusahaan || getNamaPerusahaan(item.perusahaan_id)}
                                        </td>
                                        <td className="p-4 text-slate-600">{item.jabatan}</td>
                                        <td className="p-4 text-slate-600">{item.pendidikan}</td>
                                        <td className="p-4 text-slate-600">{item.pengalaman_kerja} Tahun</td>
                                        <td className="p-4 text-slate-600 text-sm">
                                            <div>{item.sertifikasi}</div>
                                            <div className="text-xs text-slate-400">No: {item.nomor_sertifikat}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => navigate(`/personel/edit/${item.id}`)}
                                                    className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1 rounded-md text-sm font-semibold transition"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-semibold transition"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-6 text-center text-slate-400">Belum ada data tenaga ahli.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}