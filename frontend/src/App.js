import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import DonorRegister from './pages/DonorRegister';
import DonorLogin from './pages/DonorLogin';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import SearchDonor from './pages/SearchDonor';
import RegisterDonorByAdmin from './pages/RegisterDonorByAdmin';
import CreateDonation from './pages/CreateDonation';
import BloodRequest from './pages/BloodRequest';
import Donation from './pages/Donation';
import Home from './pages/Home';
import BloodBank from './pages/BloodBank';

function App() {
  
  return (
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path='/' element={<Home/>}/>

            {/* Donor Auth */}
            <Route path="/donor/login" element={<DonorLogin />} />
            <Route path="/donor/register" element={<DonorRegister />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* <Route path='/donation/new' element={<SearchDonor/>} />
            <Route path='/donation/register' element={<RegisterDonorByAdmin/>} /> */}
            {/* <Route path="/admin/dashboard" element={<AdminDashBoard />} /> */}
            {/* <Route path="/admin/register-employee" element={<AdminRegister />} /> */}
            {/* <Route path="/donor/dashboard" element={<DonorDashBoard />} /> */}

            <Route path='/searchDonor' element={<SearchDonor/>}/>
            <Route path='donation/create' element={<CreateDonation/>}/>
            <Route path='/createDonor' element={<RegisterDonorByAdmin/>}/>

            <Route path='/blood-requests' element={<BloodRequest/>}/>

            <Route path='/donations' element={<Donation/>}/>

            <Route path='/bloodbanks' element={<BloodBank/>}/>
            
          </Routes>
        </div>
      </Router>
  );
}

export default App;
