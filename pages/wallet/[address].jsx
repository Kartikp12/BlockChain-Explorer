import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { formatEther } from "ethers";

const formatTxValue = (tx) => {
  const category = tx.category;

  // ETH Transfers
  if (category === "external" || category === "internal") {
    const wei = tx?.rawContract?.value || "0x0";
    return `${formatEther(wei)} ETH`;
  }

  // ERC20 Tokens
  if (category === "erc20") {
    return `${tx.value} ${tx.asset || ""}`;
  }

  // NFT Transfers
  if (category === "erc721" || category === "erc1155") {
    return `NFT ${tx.asset || ""} #${tx.tokenId || ""}`;
  }

  return "0";
};



export default function WalletPage() {
  const router = useRouter();
  const { address } = router.query;

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) return;

    const fetchTx = async () => {
      try {
        const res = await fetch(`/api/wallet-transactions?address=${address}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch transactions");
          setTransactions([]);
          return;
        }

        setTransactions(data.transactions || []);   // <- IMPORTANT
      } catch (err) {
        console.error(err);
        setError("Request failed");
        setTransactions([]);
      }
    };

    fetchTx();
  }, [address]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => router.back()}
          className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 text-sm sm:text-base"
        >
          <span>⬅</span> <span className="hidden sm:inline">Go Back</span>
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            Wallet Transactions
          </h1>
          <p className="text-gray-300 font-mono text-xs sm:text-sm break-all bg-black/20 rounded-lg p-2 sm:p-3 mt-2">
            {address}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-red-300 font-semibold text-sm sm:text-base">{error}</p>
          </div>
        )}

        {!error && transactions.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-300 text-base sm:text-lg">No transactions found for this wallet.</p>
          </div>
        )}

        {!error && transactions.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="mb-2 sm:mb-4">
              <p className="text-gray-300 text-sm sm:text-base">
                Found <span className="text-cyan-400 font-bold">{transactions.length}</span> transaction{transactions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar pr-1 sm:pr-2 space-y-3 sm:space-y-4">
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
                        <p className="text-green-400 font-bold text-base sm:text-lg">{formatTxValue(tx)} ETH </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
