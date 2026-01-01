import { Network, Alchemy } from "alchemy-sdk"

const apiKey = process.env.ALCHEMY_API_KEY

if (!apiKey) {
  // Defer throwing until used by API handlers so we can return graceful errors
  console.warn("ALCHEMY_API_KEY is not set. API routes relying on Alchemy will fail.")
}

const alchemy = new Alchemy({
apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
})

export default alchemy