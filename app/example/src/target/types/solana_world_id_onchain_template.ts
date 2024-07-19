/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_world_id_onchain_template.json`.
 */
export type SolanaWorldIdOnchainTemplate = {
  "address": "E8byx9xyWhup2oT2PDR6w2KXHY2Fg2DFNAjj7Svx9spa",
  "metadata": {
    "name": "solanaWorldIdOnchainTemplate",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "verifyAndExecute",
      "discriminator": [
        37,
        165,
        237,
        189,
        225,
        188,
        58,
        41
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "root"
        },
        {
          "name": "config"
        },
        {
          "name": "recipient"
        },
        {
          "name": "nullifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  117,
                  108,
                  108,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "args.nullifier_hash"
              }
            ]
          }
        },
        {
          "name": "worldIdProgram",
          "address": "9QwAWx3TKg4CaTjHNhBefQeNSzEKDe2JDxL46F76tVDv"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "verifyAndExecuteArgs"
            }
          }
        }
      ]
    }
  ],
  "types": [
    {
      "name": "verifyAndExecuteArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rootHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "nullifierHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "proof",
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          }
        ]
      }
    }
  ]
};
