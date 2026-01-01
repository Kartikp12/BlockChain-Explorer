import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { formatEther } from "ethers";

const formatEth = (value) => {
  if (!value) return "0 ETH";

  try {
    // case 1: already bigint (ethers v6)
    if (typeof value === "bigint") {
      return `${formatEther(value)} ETH`;
    }

    // case 2: hex string
    if (typeof value === "string") {
      return `${formatEther(value)} ETH`;
    }

    // case 3: BigNumber object { type:..., hex:... }
    if (value?.hex) {
      return `${formatEther(value.hex)} ETH`;
    }

    // case 4: older ethers {_hex}
    if (value?._hex) {
      return `${formatEther(value._hex)} ETH`;
    }

    return "0 ETH";
  } catch {
    return "0 ETH";
  }
};

export default function TransactionsPage() {
  const router = useRouter()
  const { blockNumber } = router.query

  const [transactions, setTransactions] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {


    const fetchTransactions = async () => {
      if (!blockNumber) return
      try {
        const res = await fetch(`/api/transactions?blockNumber=${blockNumber}`)
        const data = await res.json()
        setTransactions(Array.isArray(data.transactions) ? data.transactions : [])
      } catch (e) {
        setTransactions([])
      } finally {
        setLoaded(true)
      }
    }

    fetchTransactions()
  }, [blockNumber])

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => router.back()}
          className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 text-sm sm:text-base"
        >
          <span>🔙</span> <span className="hidden sm:inline">Go Back</span>
        </button>
      </div>

      <div 
        className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-500/20 p-4 sm:p-6 md:p-8"
        style={{
          background: 'linear-gradient(to bottom right, rgba(30, 27, 75, 0.2), rgba(88, 28, 135, 0.2))',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Block: <span className="text-cyan-400">#{blockNumber}</span>
          </h1>
        </div>

        {!loaded && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-cyan-400"></div>
              <p className="text-gray-300 text-sm sm:text-base">Loading transactions...</p>
            </div>
          </div>
        )}
        {loaded && transactions.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-300 text-base sm:text-lg">No transactions found.</p>
          </div>
        )}

        {loaded && transactions.length > 0 && (
          <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
            {transactions.map((tx) => (
              <div 
                key={tx.hash}
                className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-xl p-4 sm:p-5 md:p-6 border border-purple-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide mb-1">Hash</p>
                      <p className="text-white font-mono text-xs sm:text-sm break-all" title={tx.hash}>{tx.hash}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide mb-1">From</p>
                      <p className="text-gray-300 font-mono text-xs sm:text-sm break-all" title={tx.from}>{tx.from}</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide mb-1">To</p>
                      <p className="text-gray-300 font-mono text-xs sm:text-sm break-all" title={tx.to || "Contract Creation"}>
                        {tx.to || "Contract Creation"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide mb-1">Value</p>
                      <p className="text-green-400 font-bold text-base sm:text-lg">{formatEth(tx.value)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
