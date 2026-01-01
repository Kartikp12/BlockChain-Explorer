import alchemy from "../../lib/alchemy"
import { getLatestBlockNumber, getBlockWithTransactionsByNumber } from "../../lib/etherscan"

export default async function handler(req , res) {
    try {
        let latestBlock
        try {
            latestBlock = await alchemy.core.getBlockNumber();
        } catch (e) {
            latestBlock = await getLatestBlockNumber();
        }

        let block
        try {
            block = await alchemy.core.getBlockWithTransactions(latestBlock)
        } catch (e) {
            block = await getBlockWithTransactionsByNumber(latestBlock)
        }
        const transactions = (block.transactions || []).slice(0,10)

        res.status(200).json({
            blockNumber : latestBlock ,
            timestamp : block.timestamp ,
            transactions ,
        })
    } catch (error) {
        console.error("LATEST TRANSACTIONS API ERROR:", error);
        return res.status(500).json({
          error: "Server error fetching latest transactions",
          transactions: [],
        });
      }
}