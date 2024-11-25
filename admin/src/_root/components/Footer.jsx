import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-red-700 text-white py-4">
        <div className="container mx-auto text-center">
            <small>
                <a href="#home" className="hover:underline">Home</a> • 
                <a href="#about" className="hover:underline">About</a> • 
                <a href="#contact" className="hover:underline">Contact</a>
            </small>
        </div>
    </footer>
  )
}

export default Footer