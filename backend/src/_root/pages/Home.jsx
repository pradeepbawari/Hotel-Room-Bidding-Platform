import React from 'react'
import LopInPage from '../../_auth/LopInPage'

const Home = () => {
  return (
    <>
     <div className="container mx-auto mt-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Total Products</h2>
                <p className="text-3xl font-bold text-gray-900">120</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Active Products</h2>
                <p className="text-3xl font-bold text-gray-900">90</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Inactive Products</h2>
                <p className="text-3xl font-bold text-gray-900">30</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Revenue</h2>
                <p className="text-3xl font-bold text-gray-900">$5000</p>
            </div>

        </div>
</div>
    </>
  )
}

export default Home