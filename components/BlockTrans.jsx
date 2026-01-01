import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaCube, FaHashtag, FaClock, FaExchangeAlt } from "react-icons/fa";

export default function BlockTran() {
    const [blocks, setBlocks] = useState([])
    const [loaded, setLoaded] = useState(false)
 
    const router = useRouter();
    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const res = await fetch("/api/blocks")
                const data = await res.json()
                setBlocks(Array.isArray(data.blocks) ? data.blocks : [])
            } catch (e) {
                setBlocks([])
            } finally {
                setLoaded(true)
            }
        }
        fetchBlocks();
    }, [])

    return (
        <div className="w-full h-full">
            <div 
              className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-500/20 p-4 sm:p-5 md:p-6 h-full flex flex-col"
              style={{
                background: 'linear-gradient(to bottom right, rgba(30, 27, 75, 0.2), rgba(88, 28, 135, 0.2))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(16px)'
              }}
            >
                {/* Header */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                    <FaCube className="text-xl sm:text-2xl md:text-3xl text-cyan-400 flex-shrink-0" />
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Latest Blocks</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {!loaded && (
                        <div className="flex items-center justify-center py-8 sm:py-12 flex-1">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-cyan-400"></div>
                                <span className="text-gray-300 text-sm sm:text-base">Loading blocks...</span>
                            </div>
                        </div>
                    )}
                    {loaded && blocks.length === 0 ? (
                        <div className="text-center py-8 sm:py-12 flex-1 flex items-center justify-center">
                            <span className="text-gray-300 text-base sm:text-lg">No blocks found.</span>
                        </div>
                    ) : loaded ? (
                        <div className="space-y-2 sm:space-y-3 md:space-y-4 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar flex-1">
                            {blocks.map((block, index) => (
                                <div 
                                    key={block.number}
                                    className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-xl p-3 sm:p-4 md:p-5 border border-purple-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                                >
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                                        <div className="flex items-center gap-2 sm:gap-3 bg-black/20 rounded-lg p-2 sm:p-3">
                                            <FaCube className="text-cyan-400 text-base sm:text-lg md:text-xl flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">Block</p>
                                                <p className="text-white font-bold text-sm sm:text-base md:text-lg truncate">#{block.number}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-3 bg-black/20 rounded-lg p-2 sm:p-3">
                                            <FaHashtag className="text-purple-400 text-base sm:text-lg md:text-xl flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">Hash</p>
                                                <p 
                                                    className="text-white font-mono text-[10px] sm:text-xs md:text-sm truncate" 
                                                    title={block.hash}
                                                >
                                                    {block.hash}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-3 bg-black/20 rounded-lg p-2 sm:p-3">
                                            <FaClock className="text-yellow-400 text-base sm:text-lg md:text-xl flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">Time</p>
                                                <p className="text-white text-[10px] sm:text-xs md:text-sm truncate">
                                                    {new Date(block.timestamp * 1000).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-3 bg-black/20 rounded-lg p-2 sm:p-3">
                                            <FaExchangeAlt className="text-green-400 text-base sm:text-lg md:text-xl flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">Txs</p>
                                                <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                                                    <span className="text-white font-bold text-sm sm:text-base">{block.txCount}</span>
                                                    <button 
                                                        onClick={() => router.push(`/transactions?blockNumber=${block.number}`)}
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-lg transition-all duration-200 shadow-md whitespace-nowrap"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}