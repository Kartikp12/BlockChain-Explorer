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

        const blocks = [];
        for (let i = 0; i < 5; i++) {
            try {
                const block = await alchemy.core.getBlockWithTransactions(latestBlock - i)
                blocks.push({
                    number: block.number,
                    hash: block.hash,
                    timestamp: block.timestamp,
                    txCount: block.transactions.length,
                })
            } catch (e) {
                const block = await getBlockWithTransactionsByNumber(latestBlock - i)
                blocks.push({
                    number: block.number,
                    hash: block.hash,
                    timestamp: block.timestamp,
                    txCount: block.transactions.length,
                })
            }
        }

        res.status(200).json({ blocks })
    } catch (error) {
        console.error("/api/blocks error:", error)
        res.status(200).json({ blocks: [], message: "No data available" })
    }
}