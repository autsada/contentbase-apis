import { ethers } from "ethers"

import { WebSocketProvider } from "./wsProvider"

const { NODE_ENV, LOCAL_BLOCKCHAIN_WS_URL, TESTNET_BLOCKCHAIN_WS_URL } =
  process.env

export function getWsProvider() {
  const wsURL =
    NODE_ENV === "development"
      ? LOCAL_BLOCKCHAIN_WS_URL!
      : NODE_ENV === "production"
      ? ""
      : TESTNET_BLOCKCHAIN_WS_URL!

  return new WebSocketProvider(wsURL)
}

/**
 * Get contract for listening to events.
 */
export function getContractForWs({
  address,
  contractInterface,
}: {
  address: string
  contractInterface: ethers.ContractInterface
}) {
  const wsProvider = getWsProvider()

  return new ethers.Contract(address, contractInterface, wsProvider)
}
