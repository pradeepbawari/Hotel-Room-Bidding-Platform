import React from 'react'
import Header from '../components/Header'
import SearchBlock from '../components/SearchBlock'

const NotFound = () => {
  return (
    <>
        <Header />
        <div className="bg-banner pt-12 px-4 sm:px-6 lg:px-8 md:min-h-64">
          <SearchBlock />
          </div>
        <section className='container mx-auto md:py-10 flex justify-center'>
            <h2 className='text-xl'>404 Page Not Found</h2>
        </section>        
    </>    
  )
}

export default NotFound