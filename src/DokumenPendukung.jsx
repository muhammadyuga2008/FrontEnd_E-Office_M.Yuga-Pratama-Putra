import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function DokumenPendukung() {
    const [dokumenList, setDokumenList] = useState([]);
    const [perusahaanList, setPerusahaanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterJenis, setFilterJenis] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDokumen();
    }, []);

    const fetchDokumen = async () => {
        try {
            setLoading(true);
            // Mengambil data dokumen pendukung dan data perusahaan bersamaan (mirip DataTender.jsx)
            const [resDp, resPerusahaan] = await Promise.all([
                api.get('/dp').catch(() => api.get('/dp')),
                api.get('/perusahaan').catch(() => ({ data: [] }))
            ]);

            const rawDp = resDp.data?.dp || resDp.data?.data || resDp.data || [];
            const rawPerusahaan = resPerusahaan.data?.perusahaan || resPerusahaan.data?.data || resPerusahaan.data || [];

            setDokumenList(Array.isArray(rawDp) ? rawDp : []);
            setPerusahaanList(Array.isArray(rawPerusahaan) ? rawPerusahaan : []);
        } catch (error) {
            console.error('Gagal mengambil data dokumen pendukung:', error);
            setDokumenList([]);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi pencari nama perusahaan berdasarkan perusahaan_id (Sama seperti di DataTender.jsx)
    const getNamaPerusahaan = (perusahaanId) => {
        if (!perusahaanId) return '-';
        const p = perusahaanList.find(item => Number(item.id) === Number(perusahaanId));
        return p ? (p.nama_perusahaan || p.nama) : '-';
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus dokumen pendukung ini?')) {
            try {
                await api.delete(`/dp/${id}`)
                    .catch(() => api.delete(`/dp/${id}`));
                alert('Dokumen berhasil dihapus!');
                fetchDokumen();
            } catch (error) {
                console.error('Gagal menghapus dokumen:', error);
                alert('Gagal menghapus dokumen pendukung.');
            }
        }
    };

    const filteredDokumen = dokumenList.filter((item) => {
        const search = searchTerm.toLowerCase();
        const namaDokumen = (item?.nama_dokumen || '').toLowerCase();
        const namaPerusahaan = (
            item?.perusahaan?.nama_perusahaan || 
            item?.perusahaan?.nama || 
            getNamaPerusahaan(item?.perusahaan_id)
        ).toLowerCase();

        const matchesSearch = namaDokumen.includes(search) || namaPerusahaan.includes(search);
        const matchesJenis = filterJenis === '' || item?.jenis_dokumen === filterJenis;

        return matchesSearch && matchesJenis;
    });

    return (
        <AdminLayout title="Kelola Dokumen Pendukung">
            <div className="space-y-6">
                {/* Header & Button Tambah */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Dokumen Pendukung</h2>
                        <p className="text-sm text-slate-500">Kelola dan pantau seluruh dokumen legalitas dan berkas pendukung tender</p>
                    </div>
                    <Link
                        to="/dokumen-pendukung/tambah"
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-sm gap-2"
                    >
                        <span>+</span> Tambah Dokumen
                    </Link>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama dokumen atau perusahaan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            value={filterJenis}
                            onChange={(e) => setFilterJenis(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-slate-700"
                        >
                            <option value="">Semua Jenis Dokumen</option>
                            <option value="NIB">NIB</option>
                            <option value="NPWP">NPWP</option>
                            <option value="Akta Perusahaan">Akta Perusahaan</option>
                            <option value="Sertifikat">Sertifikat / SBU</option>
                            <option value="Izin Usaha">Izin Usaha</option>
                            <option value="Lainnya">Dokumen Lainnya</option>
                        </select>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase font-bold tracking-wider">
                                    <th className="py-4 px-6">No</th>
                                    <th className="py-4 px-6">Nama Dokumen</th>
                                    <th className="py-4 px-6">Perusahaan</th>
                                    <th className="py-4 px-6">Jenis</th>
                                    <th className="py-4 px-6">Tgl Upload</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">Berkas</th>
                                    <th className="py-4 px-6 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-12 text-slate-400">
                                            Memuat data dokumen pendukung...
                                        </td>
                                    </tr>
                                ) : filteredDokumen.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-12 text-slate-400">
                                            Belum ada data dokumen pendukung.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDokumen.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-slate-50/50 transition">
                                            <td className="py-4 px-6 font-medium text-slate-400">{index + 1}</td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                {item.nama_dokumen}
                                            </td>
                                            {/* Penampilan nama perusahaan menggunakan getNamaPerusahaan */}
                                            <td className="py-4 px-6 font-semibold text-slate-700">
                                                {item.perusahaan?.nama_perusahaan || getNamaPerusahaan(item.perusahaan_id)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
                                                    {item.jenis_dokumen}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                                                {item.tanggal_upload}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                                    item.status_dokumen === 'Aktif'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                    {item.status_dokumen}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {item.file_dokumen ? (
                                                    <a
                                                        href={`/storage/${item.file_dokumen}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 underline gap-1"
                                                    >
                                                        Lihat File ↗
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Tidak ada file</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/dokumen-pendukung/edit/${item.id}`)}
                                                        className="px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}