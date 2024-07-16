import { useTonConnectUI } from "@tonconnect/ui-react";
import { Sender, SenderArguments } from "ton-core";

export function useConnection(): {
    sender: Sender;
    connected: boolean;
    walletAddress: string | null;
} {
    const [TonConnectUI] = useTonConnectUI();
    const wallet = TonConnectUI.wallet;
    const connected = TonConnectUI.connected;

    return {
        sender: {
            send: async (args: SenderArguments) => {
                await TonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString("base64"),
                        },
                    ],
                    validUntil: Date.now() + 6 * 60 * 1000,
                });
            },
        },
        connected,
        walletAddress: wallet?.account.address || null,
    };
}
