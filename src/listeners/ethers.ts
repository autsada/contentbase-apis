import { ethers } from "ethers"

import { WebSocketProvider } from "./wsProvider"

const { BLOCKCHAIN_WS_URL } = process.env

export function getWsProvider() {
  return new WebSocketProvider(BLOCKCHAIN_WS_URL!)
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
