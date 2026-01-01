
import BlockTrans from "../components/BlockTrans"
import LatestTransactions from "../components/LatestTransactions"

export default function Home(){
    return (
        <div className="w-full">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent px-2">
                        Ethereum Blockchain Explorer
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base md:text-lg px-2">Explore the latest blocks and transactions on the Ethereum network</p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    <div className="xl:col-span-1">
                        <BlockTrans/>
                    </div>
                    
                    <div className="xl:col-span-1">
                        <LatestTransactions/>
                    </div>
                </div>
            </div>
        </div>
    )
}
