export default async function handler(req, res) {
    
    const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      console.log(data);
      
      res.status(200).json({ price: data.ethereum.usd });

}