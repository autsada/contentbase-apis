"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractForWs = exports.getWsProvider = void 0;
const ethers_1 = require("ethers");
const { NODE_ENV, BLOCKCHAIN_WS_LOCAL_URL, BLOCKCHAIN_WS_TESTNET_URL } = process.env;
function getWsProvider() {
    const wsURL = NODE_ENV === "development"
        ? BLOCKCHAIN_WS_LOCAL_URL
        : NODE_ENV === "production"
            ? ""
            : BLOCKCHAIN_WS_TESTNET_URL;
    return new ethers_1.ethers.providers.WebSocketProvider(wsURL);
}
exports.getWsProvider = getWsProvider;
/**
 * Get contract for listening to events.
 */
function getContractForWs({ address, contractInterface, }) {
    const wsProvider = getWsProvider();
    return new ethers_1.ethers.Contract(address, contractInterface, wsProvider);
}
exports.getContractForWs = getContractForWs;
