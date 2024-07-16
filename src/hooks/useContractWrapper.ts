import { useEffect, useState } from "react";
import { Address, OpenedContract, toNano } from "ton-core";
import { useInit } from "./useInit";
import { MainContract } from "../contract/ContractWrapper";
import { useTonClient } from "./useTonClient";
import { useConnection } from "./useConnection";
import { useUserBalance } from "./useUserBalance";

const TRANSACTION_FEE = toNano("0.1");

export function useContractWrapper() {
    const client = useTonClient();
    const { connected, sender } = useConnection(); 
    const { balance, walletAddress } = useUserBalance();

    const [contractData, setContractData] = useState<null | {
        recent_sender: Address;
        number: number;
    }>();

    const mainContract = useInit(async () => {
        if (!client) return;
        const contract = new MainContract(
            Address.parse("kQACwi82x8jaITAtniyEzho5_H1gamQ1xQ20As_1fboIfJ4h")
        );
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return;
            setContractData(null);
            const instack = await mainContract.getData();
            setContractData({
                recent_sender: instack.recent_sender,
                number: instack.number,
            });
        }

        if (connected) {
            getValue();
        }
    }, [mainContract, connected]);

    return {
        contract_address: mainContract?.address.toString(),
        ...contractData,
        sendInternalMessage: () => {
            if (connected && balance !== null && sender && walletAddress) {
                const adjustedBalance = balance - TRANSACTION_FEE;
                if (adjustedBalance > 0) {
                    return mainContract?.sendInternalMessage(sender, adjustedBalance);
                } else {
                    console.error("Insufficient balance to cover the transaction fee.");
                }
            } else {
                console.error("Not connected or balance is null, cannot send message");
            }
        }
    };
}
