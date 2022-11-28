import { ethers } from "ethers"

const { NODE_ENV, BLOCKCHAIN_WS_LOCAL_URL, BLOCKCHAIN_WS_TESTNET_URL } =
  process.env

export function getWsProvider() {
  const wsURL =
    NODE_ENV === "development"
      ? BLOCKCHAIN_WS_LOCAL_URL!
      : NODE_ENV === "production"
      ? ""
      : BLOCKCHAIN_WS_TESTNET_URL!

  return new ethers.providers.WebSocketProvider(wsURL)
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
