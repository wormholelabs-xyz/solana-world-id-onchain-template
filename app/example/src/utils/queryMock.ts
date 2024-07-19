import {
  EthCallQueryRequest,
  EthCallQueryResponse,
  PerChainQueryRequest,
  QueryProxyMock,
  QueryRequest,
  QueryResponse,
} from "@wormhole-foundation/wormhole-query-sdk";
import axios from "axios";
import { deriveRootKey } from "./pdaHelpers";
import { PublicKey } from "@solana/web3.js";

// web3.eth.abi.encodeFunctionSignature("latestRoot()");
const LATEST_ROOT_SIGNATURE = "0xd7b0fef1";

export async function queryMock(
  programId: PublicKey,
  ethChainId: number,
  ethRpcUrl: string,
  ethWormholeAddress: string
) {
  const mock = new QueryProxyMock({
    [ethChainId]: ethRpcUrl,
  });
  const blockNumber = (
    await axios.post(ethRpcUrl, {
      method: "eth_blockNumber",
      params: [],
      id: 1,
      jsonrpc: "2.0",
    })
  )?.data?.result;
  const query = new QueryRequest(42, [
    new PerChainQueryRequest(
      ethChainId,
      new EthCallQueryRequest(blockNumber, [
        { to: ethWormholeAddress, data: LATEST_ROOT_SIGNATURE },
      ])
    ),
  ]);
  const mockQueryResponse = await mock.mock(query);
  const mockEthCallQueryResponse = QueryResponse.from(mockQueryResponse.bytes)
    .responses[0].response as EthCallQueryResponse;
  const rootHash = mockEthCallQueryResponse.results[0].substring(2);
  const rootKey = deriveRootKey(programId, Buffer.from(rootHash, "hex"), 0);

  return {
    rootKey,
    blockNumber,
    mockQueryResponse,
    mockEthCallQueryResponse,
    rootHash,
  };
}
