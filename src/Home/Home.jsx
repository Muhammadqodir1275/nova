import React from 'react'
import Carusel from '../Home/carusel'
import Navbar from '../Home/navbar/navbar'
import Card from '../Home/Card/Card'
import './style/Home.css'
import Footer from '../Home/Footer/footer'

const Home = () => {
  return (
    <div className='Cantainer'>
        <Navbar/>
        <Carusel/>
        <Card/>
        <Footer/>
    </div>
  )
}

export default Home