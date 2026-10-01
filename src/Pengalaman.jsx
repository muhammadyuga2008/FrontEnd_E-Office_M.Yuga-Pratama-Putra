import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function Pengalaman() {
    const navigate = useNavigate();
    const [pengalamanList, setPengalamanList] = useState([]);
    const [perusahaanList, setPerusahaanList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Mengambil data pengalaman proyek dan daftar perusahaan secara bersamaan
            const [resPP, resPerusahaan] = await Promise.all([
                api.get('/pp'),
                api.get('/perusahaan').catch(() => ({ data: [] }))
            ]);

            const dataPP = resPP.data['pengalaman Proyek'] || resPP.data.data || resPP.data || [];
            const dataPerusahaan = resPerusahaan.data.perusahaan || resPerusahaan.data.data || resPerusahaan.data || [];

            setPengalamanList(Array.isArray(dataPP) ? dataPP : []);
            setPerusahaanList(Array.isArray(dataPerusahaan) ? dataPerusahaan : []);
        } catch (error) {
            console.error('Gagal mengambil data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk Mencari Nama Perusahaan Berdasarkan perusahaan_id
    const getNamaPerusahaan = (perusahaanId) => {
        const p = perusahaanList.find(item => Number(item.id) === Number(perusahaanId));
        return p ? (p.nama_perusahaan || p.nama) : '-';
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pengalaman proyek ini?')) {
            try {
                await api.delete(`/pp/${id}`);
                alert('Data berhasil dihapus');
                fetchData();
            } catch (error) {
                console.error('Gagal menghapus data:', error);
                alert('Gagal menghapus data pengalaman proyek.');
            }
        }
    };

    return (
        <AdminLayout title="Data Pengalaman Proyek">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Daftar Pengalaman Proyek</h2>
                        <p className="text-sm text-slate-500">Kelola portofolio pekerjaan dan proyek perusahaan</p>
                    </div>
                    <button
                        onClick={() => navigate('/pengalaman/tambah')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
                    >
                        <span>+</span> Tambah Pengalaman
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Memuat data pengalaman...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                                    <th className="p-4 rounded-l-lg">No</th>
                                    <th className="p-4">Nama Perusahaan</th>
                                    <th className="p-4">Nama Proyek</th>
                                    <th className="p-4">Pemberi Kerja</th>
                                    <th className="p-4">Lokasi</th>
                                    <th className="p-4">Nilai Kontrak</th>
                                    <th className="p-4">Tahun</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 rounded-r-lg text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {pengalamanList.length > 0 ? (
                                    pengalamanList.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-slate-50/80 transition">
                                            <td className="p-4 font-medium text-slate-500">{index + 1}</td>
                                            <td className="p-4 font-semibold text-slate-700">
                                                {getNamaPerusahaan(item.perusahaan_id)}
                                            </td>
                                            <td className="p-4 font-bold text-slate-800">{item.nama_proyek}</td>
                                            <td className="p-4 text-slate-600">{item.pemberi_kerja || '-'}</td>
                                            <td className="p-4 text-slate-600">{item.lokasi_proyek || '-'}</td>
                                            <td className="p-4 text-emerald-600 font-semibold">
                                                {item.nilai_kontrak 
                                                    ? `Rp ${Number(item.nilai_kontrak).toLocaleString('id-ID')}` 
                                                    : '-'}
                                            </td>
                                            <td className="p-4 text-slate-600">{item.tahun_pelaksanaan || '-'}</td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                                    {item.status_proyek || 'Selesai'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/pengalaman/edit/${item.id}`)}
                                                        className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center py-8 text-slate-400">
                                            Belum ada data pengalaman proyek. Klik tombol **+ Tambah Pengalaman** untuk menambahkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}