// lib/etherscan.js
export async function getWalletTransactions(address) {
    const apiKey =  process.env.ETHERSCAN_API_KEY;
    const url = `https://api.etherscan.io/api
      ?module=account
      &action=txlist
      &address=${address}
      &startblock=0
      &endblock=99999999
      &sort=desc
      &apikey=${apiKey}`.replace(/\s+/g, '');
  
    const res = await fetch(url);
    const data = await res.json();
  
    if (data.status === "1") {
      return data.result;
    } else {
      throw new Error(data.message || "Failed to fetch transactions");
    }
  }
  
  export async function getLatestBlockNumber() {
    const apiKey =  process.env.ETHERSCAN_API_KEY;

    const url = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.result) {
      return parseInt(data.result, 16);
    }
    throw new Error("Failed to fetch latest block number from Etherscan");
  }

  export async function getBlockWithTransactionsByNumber(blockNumber) {
    const apiKey =  process.env.ETHERSCAN_API_KEY;
    const hexTag = '0x' + blockNumber.toString(16);
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${hexTag}&boolean=true&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.result) {
      const b = data.result;
      return {
        number: parseInt(b.number, 16),
        hash: b.hash,
        timestamp: parseInt(b.timestamp, 16),
        transactions: Array.isArray(b.transactions) ? b.transactions : []
      };
    }
    throw new Error("Failed to fetch block from Etherscan");
  }