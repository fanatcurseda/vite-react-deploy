import { useEffect, useState } from "react";
import { Address } from "ton-core"; 
import { useTonClient } from "./useTonClient";
import { useConnection } from "./useConnection";

export function useUserBalance() {
    const client = useTonClient();
    const { connected, walletAddress } = useConnection(); 
    const [balance, setBalance] = useState<bigint | null>(null);

    useEffect(() => {
        async function fetchBalance() {
            if (client && walletAddress) {
                try {
                    const address = Address.parse(walletAddress); 
                    const balanceResult = await client.getBalance(address);
                    setBalance(balanceResult);
                } catch (error) {
                    console.error("Failed to fetch balance:", error);
                    setBalance(null);
                }
            } else {
                setBalance(null);
            }
        }

        fetchBalance();
    }, [client, connected, walletAddress]);

    return { balance, walletAddress };
}
