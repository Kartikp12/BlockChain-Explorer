import { useEffect, useState } from "react";

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


export default function LatestTransactions() {

    const [transactions, setTransactions] = useState([])
    const [blockNumber, setBlockNumber] = useState(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const fetchtrans = async () => {
            try {
                const res = await fetch('/api/latestTrans')
                const data = await res.json()
                setTransactions(Array.isArray(data.transactions) ? data.transactions : [])
                setBlockNumber(data.blockNumber)
            } catch (e) {
                setTransactions([])
                setBlockNumber(null)
            } finally {
                setLoaded(true)
            }
        }
        fetchtrans()
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
                <div className="mb-4 sm:mb-5 md:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Latest Transactions</h2>
                    {blockNumber && (
                        <p className="text-gray-300 text-xs sm:text-sm mt-1">Block #{blockNumber}</p>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {!loaded && (
                        <div className="flex items-center justify-center py-8 sm:py-12 flex-1">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-cyan-400"></div>
                                <span className="text-gray-300 text-sm sm:text-base">Loading transactions...</span>
                            </div>
                        </div>
                    )}
                    {loaded && transactions.length === 0 && (
                        <div className="text-center py-8 sm:py-12 flex-1 flex items-center justify-center">
                            <span className="text-gray-300 text-base sm:text-lg">No transactions found.</span>
                        </div>
                    )}
                    {loaded && transactions.length > 0 && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-indigo-950/80 backdrop-blur-sm z-10">
                                        <tr className="border-b border-purple-500/30">
                                            <th className="text-left py-3 px-3 text-cyan-400 font-semibold uppercase text-xs tracking-wider">Hash</th>
                                            <th className="text-left py-3 px-3 text-cyan-400 font-semibold uppercase text-xs tracking-wider">From</th>
                                            <th className="text-left py-3 px-3 text-cyan-400 font-semibold uppercase text-xs tracking-wider">To</th>
                                            <th className="text-left py-3 px-3 text-cyan-400 font-semibold uppercase text-xs tracking-wider">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx, index) => (
                                            <tr
                                                key={tx.hash}
                                                className="border-b border-purple-500/10 hover:bg-white/5 transition-colors duration-200"
                                            >
                                                <td className="py-3 px-3">
                                                    <p className="text-white font-mono text-xs sm:text-sm truncate max-w-[120px]" title={tx.hash}>
                                                        {tx.hash.slice(0, 10)}...
                                                    </p>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <p className="text-gray-300 font-mono text-xs sm:text-sm truncate max-w-[120px]" title={tx.from}>
                                                        {tx.from.slice(0, 10)}...
                                                    </p>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <p className="text-gray-300 font-mono text-xs sm:text-sm truncate max-w-[120px]" title={tx.to || "Contract Creation"}>
                                                        {tx.to ? tx.to.slice(0, 10) + "..." : "Contract"}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <p className="text-green-400 font-semibold text-xs sm:text-sm">
                                                        {formatEth(tx.value)}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-2 sm:space-y-3">
                                {transactions.map((tx, index) => (
                                    <div
                                        key={tx.hash}
                                        className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-xl p-3 sm:p-4 border border-purple-500/20 hover:border-cyan-400/50 transition-all duration-300"
                                    >
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1">Hash</p>
                                                <p className="text-white font-mono text-xs truncate" title={tx.hash}>
                                                    {tx.hash}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1">From</p>
                                                    <p className="text-gray-300 font-mono text-xs truncate" title={tx.from}>
                                                        {tx.from}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1">To</p>
                                                    <p className="text-gray-300 font-mono text-xs truncate" title={tx.to || "Contract Creation"}>
                                                        {tx.to ? tx.to : "Contract"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1">Value</p>
                                                <p className="text-green-400 font-semibold text-sm">
                                                    {formatEth(tx.value)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}