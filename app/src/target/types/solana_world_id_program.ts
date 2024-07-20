/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_world_id_program.json`.
 */
export type SolanaWorldIdProgram = {
  "address": "9QwAWx3TKg4CaTjHNhBefQeNSzEKDe2JDxL46F76tVDv",
  "metadata": {
    "name": "solanaWorldIdProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimOwnership",
      "discriminator": [
        236,
        166,
        239,
        222,
        14,
        45,
        143,
        254
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "upgradeLock",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  112,
                  103,
                  114,
                  97,
                  100,
                  101,
                  95,
                  108,
                  111,
                  99,
                  107
                ]
              }
            ]
          }
        },
        {
          "name": "newOwner",
          "signer": true
        },
        {
          "name": "programData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  124,
                  255,
                  24,
                  248,
                  7,
                  150,
                  208,
                  255,
                  225,
                  244,
                  56,
                  157,
                  121,
                  39,
                  45,
                  3,
                  230,
                  56,
                  4,
                  46,
                  37,
                  39,
                  124,
                  197,
                  125,
                  184,
                  111,
                  162,
                  164,
                  27,
                  84,
                  229
                ]
              }
            ]
          }
        },
        {
          "name": "bpfLoaderUpgradeableProgram",
          "address": "BPFLoaderUpgradeab1e11111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "cleanUpRoot",
      "discriminator": [
        106,
        202,
        208,
        50,
        239,
        7,
        142,
        41
      ],
      "accounts": [
        {
          "name": "root",
          "docs": [
            "This can be any expired root account.",
            "The PDA check is omitted since this code allows cleaning up any root",
            "and the discriminator will still be checked."
          ],
          "writable": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "refundRecipient",
          "relations": [
            "root"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "closeSignatures",
      "discriminator": [
        192,
        65,
        63,
        117,
        213,
        138,
        179,
        190
      ],
      "accounts": [
        {
          "name": "guardianSignatures",
          "writable": true
        },
        {
          "name": "refundRecipient",
          "signer": true,
          "relations": [
            "guardianSignatures"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "deployer",
          "signer": true
        },
        {
          "name": "programData",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  124,
                  255,
                  24,
                  248,
                  7,
                  150,
                  208,
                  255,
                  225,
                  244,
                  56,
                  157,
                  121,
                  39,
                  45,
                  3,
                  230,
                  56,
                  4,
                  46,
                  37,
                  39,
                  124,
                  197,
                  125,
                  184,
                  111,
                  162,
                  164,
                  27,
                  84,
                  229
                ]
              }
            ]
          }
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "latestRoot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  97,
                  116,
                  101,
                  115,
                  116,
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ]
          }
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
              "name": "initializeArgs"
            }
          }
        }
      ]
    },
    {
      "name": "postSignatures",
      "discriminator": [
        138,
        2,
        53,
        166,
        45,
        77,
        137,
        51
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "guardianSignatures",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "guardianSignatures",
          "type": {
            "vec": {
              "array": [
                "u8",
                66
              ]
            }
          }
        },
        {
          "name": "totalSignatures",
          "type": "u8"
        }
      ]
    },
    {
      "name": "setAllowedUpdateStaleness",
      "discriminator": [
        97,
        49,
        167,
        77,
        179,
        25,
        243,
        144
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "allowedUpdateStaleness",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setRootExpiry",
      "discriminator": [
        2,
        27,
        190,
        61,
        106,
        232,
        172,
        222
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "rootExpiry",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferOwnership",
      "discriminator": [
        65,
        177,
        215,
        73,
        53,
        45,
        99,
        47
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "newOwner"
        },
        {
          "name": "upgradeLock",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  112,
                  103,
                  114,
                  97,
                  100,
                  101,
                  95,
                  108,
                  111,
                  99,
                  107
                ]
              }
            ]
          }
        },
        {
          "name": "programData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  124,
                  255,
                  24,
                  248,
                  7,
                  150,
                  208,
                  255,
                  225,
                  244,
                  56,
                  157,
                  121,
                  39,
                  45,
                  3,
                  230,
                  56,
                  4,
                  46,
                  37,
                  39,
                  124,
                  197,
                  125,
                  184,
                  111,
                  162,
                  164,
                  27,
                  84,
                  229
                ]
              }
            ]
          }
        },
        {
          "name": "bpfLoaderUpgradeableProgram",
          "address": "BPFLoaderUpgradeab1e11111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateRootWithQuery",
      "discriminator": [
        137,
        107,
        96,
        126,
        245,
        99,
        23,
        201
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "guardianSet",
          "docs": [
            "Guardian set used for signature verification."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  71,
                  117,
                  97,
                  114,
                  100,
                  105,
                  97,
                  110,
                  83,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "guardianSetIndex"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                14,
                10,
                88,
                154,
                65,
                165,
                95,
                189,
                102,
                197,
                42,
                71,
                95,
                45,
                146,
                166,
                211,
                220,
                155,
                71,
                71,
                17,
                76,
                185,
                175,
                130,
                90,
                152,
                181,
                69,
                211,
                206
              ]
            }
          }
        },
        {
          "name": "guardianSignatures",
          "docs": [
            "Stores unverified guardian signatures as they are too large to fit in the instruction data."
          ],
          "writable": true
        },
        {
          "name": "root",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "rootHash"
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ]
          }
        },
        {
          "name": "latestRoot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  97,
                  116,
                  101,
                  115,
                  116,
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "refundRecipient",
          "relations": [
            "guardianSignatures"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bytes",
          "type": "bytes"
        },
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
          "name": "guardianSetIndex",
          "type": "u32"
        }
      ]
    },
    {
      "name": "verifyGroth16Proof",
      "discriminator": [
        54,
        190,
        59,
        14,
        54,
        75,
        155,
        6
      ],
      "accounts": [
        {
          "name": "root",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "rootHash"
              },
              {
                "kind": "arg",
                "path": "verificationType"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
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
          "name": "verificationType",
          "type": {
            "array": [
              "u8",
              1
            ]
          }
        },
        {
          "name": "signalHash",
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
          "name": "externalNullifierHash",
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
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "guardianSignatures",
      "discriminator": [
        203,
        184,
        130,
        157,
        113,
        14,
        184,
        83
      ]
    },
    {
      "name": "latestRoot",
      "discriminator": [
        12,
        245,
        231,
        246,
        191,
        63,
        169,
        95
      ]
    },
    {
      "name": "root",
      "discriminator": [
        46,
        159,
        131,
        37,
        245,
        84,
        5,
        9
      ]
    },
    {
      "name": "wormholeGuardianSet",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    }
  ],
  "errors": [
    {
      "code": 6256,
      "name": "writeAuthorityMismatch",
      "msg": "writeAuthorityMismatch"
    },
    {
      "code": 6257,
      "name": "guardianSetExpired",
      "msg": "guardianSetExpired"
    },
    {
      "code": 6258,
      "name": "invalidMessageHash",
      "msg": "invalidMessageHash"
    },
    {
      "code": 6259,
      "name": "noQuorum",
      "msg": "noQuorum"
    },
    {
      "code": 6260,
      "name": "invalidGuardianIndexNonIncreasing",
      "msg": "invalidGuardianIndexNonIncreasing"
    },
    {
      "code": 6261,
      "name": "invalidGuardianIndexOutOfRange",
      "msg": "invalidGuardianIndexOutOfRange"
    },
    {
      "code": 6262,
      "name": "invalidSignature",
      "msg": "invalidSignature"
    },
    {
      "code": 6263,
      "name": "invalidGuardianKeyRecovery",
      "msg": "invalidGuardianKeyRecovery"
    },
    {
      "code": 6272,
      "name": "failedToParseResponse",
      "msg": "failedToParseResponse"
    },
    {
      "code": 6273,
      "name": "invalidNumberOfRequests",
      "msg": "invalidNumberOfRequests"
    },
    {
      "code": 6274,
      "name": "invalidRequestChainId",
      "msg": "invalidRequestChainId"
    },
    {
      "code": 6275,
      "name": "invalidRequestType",
      "msg": "invalidRequestType"
    },
    {
      "code": 6276,
      "name": "invalidRequestCallDataLength",
      "msg": "invalidRequestCallDataLength"
    },
    {
      "code": 6277,
      "name": "invalidRequestContract",
      "msg": "invalidRequestContract"
    },
    {
      "code": 6278,
      "name": "invalidRequestSignature",
      "msg": "invalidRequestSignature"
    },
    {
      "code": 6279,
      "name": "invalidNumberOfResponses",
      "msg": "invalidNumberOfResponses"
    },
    {
      "code": 6280,
      "name": "invalidResponseChainId",
      "msg": "invalidResponseChainId"
    },
    {
      "code": 6281,
      "name": "staleBlockNum",
      "msg": "staleBlockNum"
    },
    {
      "code": 6288,
      "name": "staleBlockTime",
      "msg": "staleBlockTime"
    },
    {
      "code": 6289,
      "name": "invalidResponseType",
      "msg": "invalidResponseType"
    },
    {
      "code": 6290,
      "name": "invalidResponseResultsLength",
      "msg": "invalidResponseResultsLength"
    },
    {
      "code": 6291,
      "name": "invalidResponseResultLength",
      "msg": "invalidResponseResultLength"
    },
    {
      "code": 6292,
      "name": "rootHashMismatch",
      "msg": "rootHashMismatch"
    },
    {
      "code": 6293,
      "name": "noopExpiryUpdate",
      "msg": "noopExpiryUpdate"
    },
    {
      "code": 6294,
      "name": "rootUnexpired",
      "msg": "rootUnexpired"
    },
    {
      "code": 6512,
      "name": "rootExpired",
      "msg": "rootExpired"
    },
    {
      "code": 6513,
      "name": "createGroth16VerifierFailed",
      "msg": "createGroth16VerifierFailed"
    },
    {
      "code": 6514,
      "name": "groth16ProofVerificationFailed",
      "msg": "groth16ProofVerificationFailed"
    },
    {
      "code": 10096,
      "name": "invalidPendingOwner",
      "msg": "invalidPendingOwner"
    }
  ],
  "types": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "docs": [
              "Owner of the program."
            ],
            "type": "pubkey"
          },
          {
            "name": "pendingOwner",
            "docs": [
              "Pending next owner (before claiming ownership)."
            ],
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "rootExpiry",
            "docs": [
              "Time (in seconds) after which a root should be considered expired."
            ],
            "type": "u64"
          },
          {
            "name": "allowedUpdateStaleness",
            "docs": [
              "Time (in seconds) after which an attempted update should be rejected."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "guardianSignatures",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "refundRecipient",
            "docs": [
              "Payer of this guardian signatures account.",
              "Only they may amend signatures.",
              "Used for reimbursements upon cleanup."
            ],
            "type": "pubkey"
          },
          {
            "name": "guardianSignatures",
            "docs": [
              "Unverified guardian signatures."
            ],
            "type": {
              "vec": {
                "array": [
                  "u8",
                  66
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "initializeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rootExpiry",
            "type": "u64"
          },
          {
            "name": "allowedUpdateStaleness",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "latestRoot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "readBlockNumber",
            "docs": [
              "Block number from which the root was read."
            ],
            "type": "u64"
          },
          {
            "name": "readBlockHash",
            "docs": [
              "Block hash from which the root was read."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "readBlockTime",
            "docs": [
              "Block time (in microseconds) from which the root was read."
            ],
            "type": "u64"
          },
          {
            "name": "root",
            "docs": [
              "Root hash of the last posted root account."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "verificationType",
            "docs": [
              "SEED: Verification type. Stored for off-chain convenience."
            ],
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "root",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "readBlockNumber",
            "docs": [
              "Block number from which the root was read."
            ],
            "type": "u64"
          },
          {
            "name": "readBlockHash",
            "docs": [
              "Block hash from which the root was read."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "readBlockTime",
            "docs": [
              "Block time (in microseconds) from which the root was read."
            ],
            "type": "u64"
          },
          {
            "name": "refundRecipient",
            "docs": [
              "Payer of this root account, used for reimbursements upon cleanup."
            ],
            "type": "pubkey"
          },
          {
            "name": "root",
            "docs": [
              "SEED: Root hash. Stored for off-chain convenience."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "verificationType",
            "docs": [
              "SEED: Verification type. Stored for off-chain convenience."
            ],
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "wormholeGuardianSet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "docs": [
              "Index representing an incrementing version number for this guardian set."
            ],
            "type": "u32"
          },
          {
            "name": "keys",
            "docs": [
              "Ethereum-style public keys."
            ],
            "type": {
              "vec": {
                "array": [
                  "u8",
                  20
                ]
              }
            }
          },
          {
            "name": "creationTime",
            "docs": [
              "Timestamp representing the time this guardian became active."
            ],
            "type": "u32"
          },
          {
            "name": "expirationTime",
            "docs": [
              "Expiration time when VAAs issued by this set are no longer valid."
            ],
            "type": "u32"
          }
        ]
      }
    }
  ]
};
