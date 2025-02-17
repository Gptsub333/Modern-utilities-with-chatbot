import './App.css'
import Chatbot from './components/Chatbot.jsx'
import Footer from './components/Footer.jsx'
import Homepage from './components/Homepage.jsx'
import Navbar from './components/Navbar.jsx'
import Packagesection from './components/Packagesection.jsx'
import ReviewCarousel from './components/Reviewcarousel.jsx'
import Services from './components/Services.jsx'

function App() {
  
  return (
    <>
    <Navbar />
      <div>
        <Chatbot/>
        <Homepage />
        <Packagesection/>
        <Services />
        <ReviewCarousel />
      </div>
      <Footer />
    </>
  )
}

export default App
