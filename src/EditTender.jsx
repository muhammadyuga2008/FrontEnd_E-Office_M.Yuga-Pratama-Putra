import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function EditTender() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [perusahaanList, setPerusahaanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        perusahaan_id: '',
        nama_tender: '',
        instansi: '',
        lokasi_pekerjaan: '',
        kota_pengadaan: '',
        tanggal_tender: '',
        tahun_anggaran: '',
        durasi: '',
        nilai_penawaran: '',
        status_generate: 'Draft'
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [resPerusahaan, resTender] = await Promise.all([
                    api.get('/perusahaan').catch(() => ({ data: [] })),
                    api.get(`/tender/${id}`).catch(() => api.get(`/tender/${id}`))
                ]);

                const dataP = resPerusahaan.data?.perusahaan || resPerusahaan.data?.data || resPerusahaan.data || [];
                const item = resTender.data?.tender || resTender.data?.data || resTender.data || {};

                setPerusahaanList(Array.isArray(dataP) ? dataP : []);
                setFormData({
                    perusahaan_id: item.perusahaan_id || '',
                    nama_tender: item.nama_tender || '',
                    instansi: item.instansi || '',
                    lokasi_pekerjaan: item.lokasi_pekerjaan || '',
                    kota_pengadaan: item.kota_pengadaan || '',
                    tanggal_tender: item.tanggal_tender || '',
                    tahun_anggaran: item.tahun_anggaran || '',
                    durasi: item.durasi || '',
                    nilai_penawaran: item.nilai_penawaran || '',
                    status_generate: item.status_generate || 'Draft'
                });
            } catch (error) {
                console.error('Gagal mengambil data tender:', error);
                alert('Gagal memuat data tender.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/tender/${id}`, formData).catch(() => api.put(`/updatetender/${id}`, formData));
            alert('Data tender berhasil diperbarui!');
            navigate('/tender');
        } catch (error) {
            console.error('Gagal memperbarui data tender:', error);
            alert('Gagal memperbarui data tender.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout title="Edit Data Tender">
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Edit Data Tender</h2>
                        <p className="text-sm text-slate-500">Perbarui rincian data tender penawaran</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/tender')}
                        className="text-slate-500 hover:text-slate-700 text-sm font-semibold transition"
                    >
                        ← Kembali
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Memuat data form...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Perusahaan Select */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Perusahaan <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    name="perusahaan_id"
                                    value={formData.perusahaan_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                >
                                    <option value="">-- Pilih Perusahaan --</option>
                                    {perusahaanList.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama_perusahaan || p.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nama Tender */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Nama Tender / Pekerjaan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nama_tender"
                                    value={formData.nama_tender}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                />
                            </div>

                            {/* Instansi */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Instansi / Pemberi Kerja <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="instansi"
                                    value={formData.instansi}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                />
                            </div>

                            {/* Nilai Penawaran */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Nilai Penawaran (Rp) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="nilai_penawaran"
                                    value={formData.nilai_penawaran}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                />
                            </div>

                            {/* Lokasi Pekerjaan */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Lokasi Pekerjaan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lokasi_pekerjaan"
                                    value={formData.lokasi_pekerjaan}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                />
                            </div>

                            {/* Kota Pengadaan */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Kota Pengadaan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="kota_pengadaan"
                                    value={formData.kota_pengadaan}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                />
                            </div>

                            {/* Tanggal Tender */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Tanggal Tender <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="tanggal_tender"
                                    value={formData.tanggal_tender}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                />
                            </div>

                            {/* Tahun Anggaran */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Tahun Anggaran <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength="4"
                                    name="tahun_anggaran"
                                    value={formData.tahun_anggaran}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                />
                            </div>

                            {/* Durasi */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Durasi Pekerjaan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="durasi"
                                    value={formData.durasi}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                />
                            </div>

                            {/* Status Generate */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                                    Status Generate Dokumen
                                </label>
                                <select
                                    name="status_generate"
                                    value={formData.status_generate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm text-slate-800"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => navigate('/tender')}
                                className="px-5 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-sm transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-5 py-2.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-sm transition shadow-sm disabled:opacity-50"
                            >
                                {submitting ? 'Memperbarui...' : 'Update Tender'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}