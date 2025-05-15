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
import CreateBloodBank from './pages/CreateBloodBank';
import SelectLocation from './pages/SelectLocation';
import CreateHospital from './pages/CreateHospital';
import BloodBanks from './pages/superadmin/BloodBanks';
import BloodBankDetails from './pages/superadmin/BloodBankDetails';
import Hospitals from './pages/superadmin/Hospitals';
import Donors from './pages/superadmin/Donors';
import ChatBot from './pages/ChatBot';

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

            <Route path='/create/bloodbank' element={<CreateBloodBank/>}/>
            <Route path='/create/hospital' element={<CreateHospital/>}/>
            <Route path='/select-location' element={<SelectLocation/>}/>

            <Route path="/superadmin/bloodbanks" element={<BloodBanks />} />
            <Route path="/superadmin/bloodbanks/:id" element={<BloodBankDetails />} />

            <Route path="/superadmin/hospitals" element={<Hospitals />} />
            
            <Route path="/superadmin/donors" element={<Donors/>} />

            <Route path='/chatbot' element={<ChatBot/>}/>
            
          </Routes>
        </div>
      </Router>
  );
}

export default App;
