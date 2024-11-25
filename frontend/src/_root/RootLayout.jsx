import React from 'react'
import Header from './components/Header'
import SearchBlock from './components/SearchBlock'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'

const RootLayout = () => {
  return (
    <>
      <Header />
      <div className="bg-banner pt-12 px-4 sm:px-6 lg:px-8 md:min-h-32">
        <SearchBlock />
      </div>
      <section className='container mx-auto md:py-10'>
        <Outlet />
      </section>
      <Footer />
    </>
  )
}

export default RootLayout