import { Alchemy, Network } from "alchemy-sdk";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.ALCHEMY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing ALCHEMY_API_KEY",
        transactions: []
      });
    }

    const alchemy = new Alchemy({
      apiKey,
      network: Network.ETH_MAINNET,
    });

    // Get latest block number
    const latestBlock = await alchemy.core.getBlockNumber();

    // Get latest block with transactions
    let block = await alchemy.core.getBlockWithTransactions(latestBlock);

    // fallback: if block somehow empty, go backwards until we find txs
    let step = 1;
    while (block && (!block.transactions || block.transactions.length === 0)) {
      block = await alchemy.core.getBlockWithTransactions(latestBlock - step);
      step++;
      if (step > 5) break;
    }

    return res.status(200).json({
      transactions: block?.transactions || []
    });

  } catch (error) {
    console.error("LATEST TRANSACTIONS API ERROR:", error);
    return res.status(500).json({
      error: "Server error fetching latest transactions",
      transactions: []
    });
  }
}
