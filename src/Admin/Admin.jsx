import React from 'react'
import AdminEdit from './AdminEdit'
import Dashboard from './Dashboard'
import DashboardStats from './DashboardStats'
import Adminpayment from './Adminpayment'
const Admin = () => {
  return (
   <>
   <Dashboard/>
   <DashboardStats/>
   <Adminpayment/>
   <AdminEdit/>
   </>
  )
}

export default Admin
