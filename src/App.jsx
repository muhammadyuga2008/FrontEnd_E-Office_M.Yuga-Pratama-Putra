import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';
import DataPerusahaan from './DataPerusahaan';
import TambahPerusahaan from './TambahPerusahaan';
import EditPerusahaan from './EditPerusahaan';
import DataPersonel from './DataPersonel';
import TambahPersonel from './TambahPersonel';
import EditPersonel from './EditPersonel';
import Pengalaman from './Pengalaman';
import TambahPengalaman from './TambahPengalaman';
import EditPengalaman from './EditPengalaman';
import DataTender from './DataTender';
import TambahTender from './TambahTender';
import EditTender from './EditTender';
import DokumenPendukung from './DokumenPendukung';
import GenerateMdp from './GenerateMdp';


function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman utama otomatis diarahkan ke login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/Perusahaan" element={<DataPerusahaan />} />
        <Route path="/Perusahaan/Tambah" element={<TambahPerusahaan />} />
        <Route path="/Perusahaan/Edit/:id" element={<EditPerusahaan />} />
        <Route path="/personel" element={<DataPersonel />} />
        <Route path="/personel/tambah" element={<TambahPersonel />} />
        <Route path="/personel/edit/:id" element={<EditPersonel />} />

       <Route path="/pengalaman" element={<Pengalaman />} />
       <Route path="/pengalaman/tambah" element={<TambahPengalaman />} />
       <Route path="/pengalaman/edit/:id" element={<EditPengalaman />} />


        <Route path="/tender" element={<DataTender />} />
        <Route path="/tender/tambah" element={<TambahTender />} />
         <Route path="/tender/edit/:id" element={<EditTender />} />

         <Route path="/dokumenpendukung" element={<DokumenPendukung />} />
         <Route path="/generate-mdp" element={<GenerateMdp />} />
      </Routes>
    </Router>
  );
}

export default App;