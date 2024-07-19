import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  EthCallQueryRequest,
  EthCallQueryResponse,
  QueryProxyMock,
  QueryResponse,
} from "@wormhole-foundation/wormhole-query-sdk";
import { BN } from "bn.js";
import { deriveLatestRootKey } from "./latestRoot";
import { signaturesToSolanaArray } from "./signaturesToSolanaArray";
import { SolanaWorldIdProgram } from "./solana_world_id_program";

// This is a testing helper for posting roots to the Solana World ID Program so that groth16 proofs can be verified against them.
export async function mockUpdateRoot(
  program: Program<SolanaWorldIdProgram>,
  rootHash: number[]
) {
  const slot = await program.provider.connection.getSlot();
  const blockTimeInSeconds = await program.provider.connection.getBlockTime(
    slot
  );

  if (!blockTimeInSeconds) {
    throw new Error("Block time is undefined");
  }
  const blockTime = new BN(blockTimeInSeconds).mul(new BN(1_000_000)); // seconds to microseconds;
  const latestRootKey = deriveLatestRootKey(program.programId, 0);
  const latestRoot = await program.account.latestRoot.fetch(latestRootKey);
  // this is a query response from mainnet that can be used as the basis for an update
  // https://github.com/wormholelabs-xyz/solana-world-id-program/blob/a52c055663f12871beace3024a2608c6fb8ce04d/tests/solana-world-id-program.ts#L266
  const mockQueryResponse =
    "010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000037010000002a010002010000002a0000000930783133363635613001f7134ce138832c1456f2a91d64621ee90c2bddea00000004d7b0fef1010002010000005500000000013665a0b4d1f4641086607c69154ed3a94cb8d37ff925a441f98057863ff02bf75e768400061d9d5184e9c0010000002001ba3a37ccad06a0a974a9813b989ceeb4b31d34d2b236e194a2c3c4698e0f2b";
  const queryResponse = QueryResponse.from(mockQueryResponse);
  const ethCallResponse = queryResponse.responses[0]
    .response as EthCallQueryResponse;
  // chain must be Sepolia
  queryResponse.request.requests[0].chainId = 10002;
  queryResponse.responses[0].chainId = 10002;
  // contract must be the testnet World ID Identity Manager
  (
    queryResponse.request.requests[0].query as EthCallQueryRequest
  ).callData[0].to = "0x928a514350A403e2f5e3288C102f6B1CCABeb37C";
  // block number must be after the latest root
  ethCallResponse.blockNumber =
    BigInt(latestRoot.readBlockNumber.toString()) + BigInt(1);
  // block time must be within allowed update staleness, set the current slot time
  ethCallResponse.blockTime = BigInt(blockTime.toString());
  ethCallResponse.results[0] = `0x${Buffer.from(rootHash).toString("hex")}`;
  const bytes = queryResponse.serialize();
  const signatures = new QueryProxyMock({}).sign(bytes);
  const signatureData = signaturesToSolanaArray(signatures);
  const signaturesKeypair = Keypair.generate();
  await program.methods
    .postSignatures(signatureData, signatureData.length)
    .accounts({ guardianSignatures: signaturesKeypair.publicKey })
    .signers([signaturesKeypair])
    .rpc();
  await program.methods
    .updateRootWithQuery(Buffer.from(bytes), rootHash, 0)
    .accountsPartial({
      guardianSet: new PublicKey("dxZtypiKT5D9LYzdPxjvSZER9MgYfeRVU5qpMTMTRs4"), // mock guardian set in Anchor.toml
      guardianSignatures: signaturesKeypair.publicKey,
    })
    .rpc();
}

