/**
 * CoinGecko API Integration for Pirate Chain Converter
 * This module fetches real-time cryptocurrency rates from CoinGecko
 */

const API = {
    // Base URL for CoinGecko API (v3)
    baseUrl: 'https://api.coingecko.com/api/v3',
    
    // API key (if you have one - leave as null for free tier)
    apiKey: null,
    
    /**
     * Get the latest exchange rates for ARRR (Pirate Chain)
     * @returns {Promise<Object>} Object containing exchange rates
     */
    async getArrrRates() {
        try {
            // Construct the API parameters
            const params = new URLSearchParams({
                ids: 'pirate-chain',
                vs_currencies: 'usd,eur,btc',
                include_24hr_vol: 'true',
                include_market_cap: 'true'
            });
            
            // Add API key if available
            const headers = this.apiKey ? { 'x-cg-api-key': this.apiKey } : {};
            
            // Get ARRR to USD, EUR, BTC rates
            const response = await fetch(`${this.baseUrl}/simple/price?${params.toString()}`, { headers });
            const data = await response.json();
            
            if (!data['pirate-chain']) {
                throw new Error('Failed to fetch ARRR data from CoinGecko');
            }
            
            // Get conversion rates for VRSC and KMD
            const altParams = new URLSearchParams({
                ids: 'verus-coin,komodo',
                vs_currencies: 'usd'
            });
            
            const verusResponse = await fetch(`${this.baseUrl}/simple/price?${altParams.toString()}`, { headers });
            const verusData = await verusResponse.json();
            
            // Format timestamp for "last updated"
            const now = new Date();
            const formattedDate = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Calculate the conversion rates
            const rates = {
                ARRR_TO_USD: data['pirate-chain'].usd,
                ARRR_TO_EUR: data['pirate-chain'].eur,
                ARRR_TO_BTC: data['pirate-chain'].btc,
                // Calculate VRSC rate through USD
                ARRR_TO_VRSC: verusData['verus-coin'] ? data['pirate-chain'].usd / verusData['verus-coin'].usd : 0.89,
                // Calculate KMD rate through USD
                ARRR_TO_KMD: verusData['komodo'] ? data['pirate-chain'].usd / verusData['komodo'].usd : 0.75,
                // Additional market data
                MARKET_CAP: data['pirate-chain'].usd_market_cap,
                VOLUME_24H: data['pirate-chain'].usd_24h_vol,
                LAST_UPDATED: formattedDate
            };
            
            // Log success for debugging
            console.log('Successfully fetched rates from CoinGecko:', rates);
            
            return rates;
        } catch (error) {
            console.error('Error fetching exchange rates from CoinGecko:', error);
            
            // Return default rates as fallback
            return {
                ARRR_TO_BTC: 0.0000037,
                ARRR_TO_USD: 0.54,
                ARRR_TO_EUR: 0.49,
                ARRR_TO_VRSC: 0.89,
                ARRR_TO_KMD: 0.75,
                MARKET_CAP: 99347890,
                VOLUME_24H: 432875,
                LAST_UPDATED: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) + ' (Default)'
            };
        }
    },
    
    /**
     * Get historical price data for charts
     * @param {string} days - Number of days to fetch (1, 7, 30, 90, 365)
     * @returns {Promise<Object>} Object containing historical price data
     */
    async getHistoricalData(days = '30') {
        try {
            // Default parameters
            const params = new URLSearchParams({
                vs_currency: 'usd',
                days: days
            });
            
            // Add API key if available
            const headers = this.apiKey ? { 'x-cg-api-key': this.apiKey } : {};
            
            // Fetch historical data
            const response = await fetch(`${this.baseUrl}/coins/pirate-chain/market_chart?${params.toString()}`, { headers });
            const data = await response.json();
            
            return {
                prices: data.prices, // Array of [timestamp, price] pairs
                market_caps: data.market_caps,
                total_volumes: data.total_volumes
            };
        } catch (error) {
            console.error('Error fetching historical data:', error);
            return {
                prices: [],
                market_caps: [],
                total_volumes: []
            };
        }
    },
    
    /**
     * Set the API key for authenticated requests
     * @param {string} key - Your CoinGecko API key
     */
    setApiKey(key) {
        this.apiKey = key;
        console.log('API key has been set');
    }
};

export default API;