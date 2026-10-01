import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function DataPerusahaan() {
    const [perusahaanList, setPerusahaanList] = useState([]);
    const navigate = useNavigate();

    const fetchPerusahaan = async () => {
        try {
            const response = await api.get('/perusahaan');
            setPerusahaanList(response.data.perusahaan || []);
        } catch (error) {
            console.error('Gagal mengambil data', error);
        }
    };

    useEffect(() => {
        fetchPerusahaan();
    }, []);

    // Fungsi untuk menghapus data
    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data perusahaan ini?')) {
            try {
                await api.delete(`/deleteperusahaan/${id}`);
                alert('Data berhasil dihapus!');
                fetchPerusahaan(); // Refresh data tabel setelah dihapus
            } catch (error) {
                console.error('Gagal menghapus data', error);
                alert('Gagal menghapus data perusahaan.');
            }
        }
    };

    return (
        <AdminLayout title="Data Perusahaan">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-slate-800">Daftar Perusahaan</h1>
                <button 
                    onClick={() => navigate('/perusahaan/tambah')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition"
                >
                    + Tambah Data
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
                            <th className="p-4">No</th>
                            <th className="p-4">Nama Perusahaan</th>
                            <th className="p-4">NPWP / NIB</th>
                            <th className="p-4">Direktur</th>
                            <th className="p-4">Kontak</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {perusahaanList.length > 0 ? (
                            perusahaanList.map((item, index) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-4 text-slate-500">{index + 1}</td>
                                    <td className="p-4 font-semibold text-slate-800">{item.nama_perusahaan}</td>
                                    <td className="p-4 text-slate-600 text-sm">
                                        <div><span className="font-medium">NPWP:</span> {item.npwp}</div>
                                        <div><span className="font-medium">NIB:</span> {item.nib}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 text-sm">
                                        <div>{item.nama_direktur}</div>
                                        <div className="text-xs text-slate-400">{item.jabatan_direktur}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 text-sm">
                                        <div>{item.no_telepon}</div>
                                        <div className="text-xs text-slate-400">{item.email}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => navigate(`/perusahaan/edit/${item.id}`)}
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
                                <td colSpan="6" className="p-6 text-center text-slate-400">Belum ada data perusahaan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}