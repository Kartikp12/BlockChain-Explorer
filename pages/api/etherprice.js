export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch Ethereum price");
        }

        const data = await response.json();

        const price = data?.ethereum?.usd;
        const change24h = data?.ethereum?.usd_24h_change;

        res.status(200).json({
            price: price ?? null,
            change24h: change24h ?? null
        });

    } catch (error) {
        console.error("Ethereum price API error:", error);

        res.status(500).json({
            price: null,
            change24h: null
        });
    }
}
