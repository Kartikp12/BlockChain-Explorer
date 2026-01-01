import { Alchemy, Network } from "alchemy-sdk";

export default async function handler(req, res) {
  const { address } = req.query;

  if (!address || !address.startsWith("0x") || address.length !== 42) {
    return res
      .status(400)
      .json({ error: "Invalid wallet address", transactions: [] });
  }

  try {
    const alchemy = new Alchemy({
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    });

    // ========== 1️⃣ INCOMING ==========
    const incoming = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
      withMetadata: true,
      order: "desc",
      maxCount: "0x32",
    });

    // ========== 2️⃣ OUTGOING ==========
    const outgoing = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
      withMetadata: true,
      order: "desc",
      maxCount: "0x32",
    });

    // ========== 3️⃣ MERGE + SORT ==========
    const combined = [...(incoming.transfers || []), ...(outgoing.transfers || [])];

    combined.sort(
      (a, b) =>
        new Date(b.metadata.blockTimestamp) -
        new Date(a.metadata.blockTimestamp)
    );

    return res.status(200).json({
      transactions: combined,
    });

  } catch (err) {
    console.error("Alchemy Wallet API Error:", err);
    return res.status(500).json({
      error: "Server error fetching wallet activity",
      transactions: [],
    });
  }
}
