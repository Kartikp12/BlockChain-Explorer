import { Alchemy, Network } from "alchemy-sdk";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.ALCHEMY_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Missing ALCHEMY_API_KEY", blocks: [] });
    }

    const alchemy = new Alchemy({
      apiKey,
      network: Network.ETH_MAINNET,
    });

    const latestBlock = await alchemy.core.getBlockNumber();
    const blocks = [];

    // Get last 10 blocks WITH tx data
    for (let i = 0; i < 10; i++) {
      const block = await alchemy.core.getBlockWithTransactions(
        latestBlock - i
      );

      if (!block) continue;

      blocks.push({
        number: block.number,
        hash: block.hash || "",
        timestamp: block.timestamp * 1000,
        transactions: block.transactions || [],
        txCount: block.transactions?.length || 0    // 👈 ADD THIS
      });
    }

    return res.status(200).json({ blocks });

  } catch (error) {
    console.error("BLOCKS API ERROR:", error);
    return res
      .status(500)
      .json({ error: "Server Error", blocks: [] });
  }
}
