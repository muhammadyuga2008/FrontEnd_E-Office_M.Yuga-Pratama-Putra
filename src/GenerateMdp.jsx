import React, { useState, useEffect } from 'react';
import api from './api';

export default function GenerateMdp() {
    // State Master Data
    const [tenderList, setTenderList] = useState([]);
    const [perusahaanList, setPerusahaanList] = useState([]);
    const [personelList, setPersonelList] = useState([]);
    const [pengalamanList, setPengalamanList] = useState([]);

    // State Input Pilihan User
    const [selectedTender, setSelectedTender] = useState('');
    const [selectedPerusahaan, setSelectedPerusahaan] = useState('');
    const [selectedPersonel, setSelectedPersonel] = useState([]);
    const [selectedPengalaman, setSelectedPengalaman] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        try {
            setLoading(true);

            const [resTender, resPerusahaan, resPersonel, resPengalaman] = await Promise.all([
                api.get('/tender').catch(err => { console.error('Error Tender:', err); return null; }),
                api.get('/perusahaan').catch(err => { console.error('Error Perusahaan:', err); return null; }),
                api.get('/personel').catch(err => { console.error('Error Personel:', err); return null; }),
                api.get('/pp').catch(err => { console.error('Error Pengalaman:', err); return null; }),
            ]);

            // Mapping Tender, Perusahaan, dan Personel
            if (resTender?.data?.tender) setTenderList(resTender.data.tender);
            if (resPerusahaan?.data?.perusahaan) setPerusahaanList(resPerusahaan.data.perusahaan);
            if (resPersonel?.data?.personel) setPersonelList(resPersonel.data.personel);

            // Response dari PengalamanProyekController index() menggunakan key 'pengalaman Proyek'
            if (resPengalaman?.data) {
                const dataPp = resPengalaman.data['pengalaman Proyek'] || resPengalaman.data.pp || [];
                setPengalamanList(dataPp);
            }

        } catch (error) {
            console.error('Gagal mengambil master data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxToggle = (id, list, setList) => {
        if (list.includes(id)) {
            setList(list.filter(item => item !== id));
        } else {
            setList([...list, id]);
        }
    };

    const handleGeneratePdf = async () => {
        if (!selectedTender || !selectedPerusahaan) {
            alert('Pilih Tender dan Perusahaan terlebih dahulu!');
            return;
        }
        if (selectedPersonel.length === 0 || selectedPengalaman.length === 0) {
            alert('Pilih minimal 1 Personel dan 1 Pengalaman Proyek!');
            return;
        }

        try {
            setIsGenerating(true);
            
            const response = await api.post('/generate-mdp', {
                tender_id: selectedTender,
                perusahaan_id: selectedPerusahaan,
                personel_ids: selectedPersonel,
                pengalaman_proyek_ids: selectedPengalaman
            }, {
                responseType: 'blob' 
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Dokumen_MDP_Tender_${selectedTender}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Gagal generate PDF:', error);
            alert('Terjadi kesalahan saat memproses dokumen MDP.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-600">Memuat Master Data...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Generate Dokumen MDP</h1>
                    <p className="text-sm text-slate-500">Pilih data pendukung untuk dibuatkan otomatis dokumen penawaran PDF</p>
                </div>
                <button
                    onClick={handleGeneratePdf}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition disabled:bg-slate-300 cursor-pointer"
                >
                    {isGenerating ? 'Mencetak PDF...' : '📄 Generate & Download PDF'}
                </button>
            </div>

            {/* Step 1: Tender & Perusahaan */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Paket Tender</label>
                    <select
                        value={selectedTender}
                        onChange={(e) => setSelectedTender(e.target.value)}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Pilih Tender --</option>
                        {tenderList.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.nama_tender} ({t.instansi})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Perusahaan Penawar</label>
                    <select
                        value={selectedPerusahaan}
                        onChange={(e) => setSelectedPerusahaan(e.target.value)}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Pilih Perusahaan --</option>
                        {perusahaanList.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.nama_perusahaan}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Step 2: Personel */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-3">Pilih Personel Kunci</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
                    {personelList.map(p => (
                        <label key={p.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedPersonel.includes(p.id)}
                                onChange={() => handleCheckboxToggle(p.id, selectedPersonel, setSelectedPersonel)}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <div>
                                <p className="text-sm font-bold text-slate-800">{p.nama_personel}</p>
                                <p className="text-xs text-slate-500">{p.jabatan} - {p.pendidikan}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Step 3: Pengalaman Proyek */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-3">Pilih Pengalaman Proyek</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
                    {pengalamanList.map(item => (
                        <label key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedPengalaman.includes(item.id)}
                                onChange={() => handleCheckboxToggle(item.id, selectedPengalaman, setSelectedPengalaman)}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <div>
                                <p className="text-sm font-bold text-slate-800">{item.nama_proyek}</p>
                                <p className="text-xs text-slate-500">{item.pemberi_kerja} ({item.tahun_pelaksanaan})</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}