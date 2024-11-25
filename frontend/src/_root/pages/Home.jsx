import React from 'react'
import LopInPage from '../../_auth/LopInPage'

const Home = () => {
  return (
    <>
      <main className="container mx-auto">
        <div className="grid gap-10">
            <section className="bg-white p-6 pt-0 rounded-lg shadow-lg">
                <hgroup className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Nature Stay</h2>
                    <h3 className="text-md text-gray-700">Experience the serenity of nature in our exquisite hotels</h3>
                </hgroup>
                {/* <p className="mb-6">Discover and bid on beautiful rooms located in nature's most serene locations.</p> */}
                <figure className="mb-6">
                    <img className="w-full h-64 object-cover rounded-lg" src="../src/assets/images/andrea-davis-VOWXF7lsAN0-unsplash.jpg" alt="Nature-themed hotel" />
                </figure>
                <h3 className="text-2xl font-bold mb-4">Our Hotels</h3>
                <p className="mb-6">We offer a selection of hotels that bring you closer to nature. Each hotel is carefully selected to ensure a peaceful and rejuvenating experience.</p>
                <h3 className="text-2xl font-bold mb-4">How it Works</h3>
                <p>Bid on rooms that you like. The highest bidder wins the stay. It's that simple! Explore our listings and place your bids to secure your stay in nature's lap.</p>
            </section>
        </div>
    </main>

    <section aria-label="Subscribe example">
        <div className="container mx-auto">
            <article className="bg-white p-6 rounded-lg shadow-lg">
                <hgroup className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
                    <h3 className="text-xl text-gray-700">Stay updated with the latest offers and listings</h3>
                </hgroup>
                <form className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <input type="text" id="firstname" name="firstname" placeholder="First Name" aria-label="First Name" required className="p-3 border border-gray-300 rounded" />
                    <input type="email" id="email" name="email" placeholder="Email Address" aria-label="Email Address" required className="p-3 border border-gray-300 rounded" />
                    <button type="submit" className="bg-red-700 text-white px-6 py-3 rounded hover:bg-green-600">Subscribe</button>
                </form>
            </article>
        </div>
    </section>
    </>
  )
}

export default Home