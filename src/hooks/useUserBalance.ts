import { useEffect, useState } from "react";
import { Address } from "ton-core"; 
import { useTonClient } from "./useTonClient";
import { useConnection } from "./useConnection";

export function useUserBalance() {
    const client = useTonClient();
    const { connected, walletAddress } = useConnection(); 
    const [balance, setBalance] = useState<bigint | null>(null);

    const fetchBalance = async () => {
        if (client && walletAddress) {
            try {
                const address = Address.parse(walletAddress); 
                const balanceResult = await client.getBalance(address);
                setBalance(balanceResult);
                console.log(balanceResult);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
                setBalance(null);
            }
        } else {
            setBalance(null);
            console.log("Нету нихуя на балансе");
        }
    };

    useEffect(() => {
        if (connected) {
            fetchBalance();
        } else {
            setBalance(null);
        }
    }, [client, connected, walletAddress]);

    return { balance, walletAddress, fetchBalance };
}
