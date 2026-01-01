import React, { useState , useEffect } from 'react'
import { FaSearch, FaEthereum } from "react-icons/fa";
import { useRouter } from "next/router";

const NavBar = () => {

  const [ethPrice , setEthPrice] = useState()

  const [search , setSearch] = useState("")
  const router = useRouter();

  const handleSearch = () => {
    if (search.startsWith("0x") && search.length === 42) {
      router.push(`/wallet/${search}`);
    } else {
      alert("Please enter a valid wallet address.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(()=>{
    const fetchprice = async () =>{
      const res = await fetch("/api/etherprice")
      const data = await res.json();
      console.log(data);
    
      
      setEthPrice(data.price)
    }
    fetchprice()
    
    
  } , [])


  return (
    <nav 
      className="sticky top-0 z-50 bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 shadow-xl border-b border-indigo-500/30 backdrop-blur-lg"
      style={{
        background: 'linear-gradient(to right, #1e1b4b, #581c87, #1e1b4b)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <FaEthereum className="text-2xl sm:text-3xl text-cyan-400" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white whitespace-nowrap">Ethereum Explorer</h1>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md lg:max-w-lg">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-xl p-1.5 sm:p-2 border border-white/10 shadow-lg">
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <FaSearch className="text-cyan-400 ml-1 sm:ml-2 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search wallet (0x...)" 
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm sm:text-base outline-none min-w-0"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-sm sm:text-base whitespace-nowrap shadow-md hover:shadow-cyan-500/50"
                style={{
                  background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                  color: '#ffffff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}
              >
                Search
              </button>
            </div>
          </div>

          {/* ETH Price */}
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-xl px-3 sm:px-4 py-2 border border-white/10 shadow-lg w-full sm:w-auto justify-center sm:justify-start">
            <FaEthereum className="text-lg sm:text-xl text-cyan-400 flex-shrink-0" />
            <span className="text-white font-semibold text-sm sm:text-base whitespace-nowrap">
              ${ethPrice ? parseFloat(ethPrice).toFixed(2) : '...'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar

