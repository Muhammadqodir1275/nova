import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import Home from '../home/Home';
import Barchasi from '../Home/Barchasi';
import Login from '../LoginPage/Login';
import Register from '../LoginPage/Register';
import Page from '../Page/Page';
import Obuna from '../Obuna/Obuna';
import LikedPage from '../Tanlangan/LikedPage';
import Admin from '../Admin/admin';
import Payment from '../Obuna/Payment';
import AdminEditPage from '../Admin/AdminEdit';
import Navbar from '../Home/navbar/navbar';
import Footer from '../Home/Footer/footer';
import { useSelector, useDispatch } from 'react-redux';
import { setError, setLoading } from '../store/authSlice';
import { useSakura } from '../Home/context/context';
import SakuraRain from '../Home/Sakura/SakuraRain';

const App = () => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state.auth);
  const { showSakura } = useSakura();

  useEffect(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
      dispatch(setError(null));
    }, 2000);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="line">
        <div className="loader"></div>
      </div>
    );
  }

 
  if (isError) {
    return <div className="error">❌ Xatolik yuz berdi! Qayta urinib ko‘ring...</div>;
  }

  return (
    <>
      {showSakura && <SakuraRain />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Barchsi' element={<Barchasi />} />
        <Route path='/Login' element={<><Navbar /><Login /><Footer /></>} />
        <Route path='/Register' element={<><Navbar /><Register /><Footer /></>} />
        <Route path='/Page/:id' element={<><Navbar /><Page /><Footer /></>} />
        <Route path='/obuna' element={<><Navbar /><Obuna /><Footer /></>} />
        <Route path='/tanlangan' element={<><Navbar /><LikedPage /><Footer /></>} />
        <Route path='/admin' element={<><Navbar /><Admin /><Footer /></>} />
        <Route path='/payment/:id' element={<><Navbar /><Payment /><Footer /></>} />
        <Route path='/admin-anime/:id' element={<><Navbar /><AdminEditPage /><Footer /></>} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
