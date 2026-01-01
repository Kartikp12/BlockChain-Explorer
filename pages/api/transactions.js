import alchemy from "../../lib/alchemy"

export default async function handler(req , res) {
    try {
        const { blockNumber } = req.query
        if (!blockNumber) {
            return res.status(400).json({ message: "Missing blockNumber query param" })
        }
        const parsed = parseInt(blockNumber)
        if (Number.isNaN(parsed)) {
            return res.status(400).json({ message: "Invalid blockNumber" })
        }
        const block = await alchemy.core.getBlockWithTransactions(parsed)
        res.status(200).json({ transactions: block.transactions })
    } catch (error) {
        console.error("/api/transactions error:", error)
        res.status(200).json({ transactions: [] })
    }
}