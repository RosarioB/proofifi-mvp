#!/bin/bash

curl -X POST \
     -H 'Content-Type: application/json' \
     -H 'Authorization: <auth code>' \
     -d '{
          "domain":"proofifi.eth",
          "name":"rosariob",
          "address":"0xA60638304EB24C5581e9F57abfAc40cc9F0187c8",
          "text_records": {
            "com.twitter": "proofifi",
            "com.github":"TheNick87",
            "com.discord":"pez2885",
            "url":"https://www.proofifi.eth",
            "location":"Rome",
            "description":"APIs are cool"
          },
          "contenthash": "https://aquamarine-statistical-canidae-416.mypinata.cloud/ipfs/QmekqMJ2DQw1FAwCii1EJ4n6NWAoUF2AXvmni8BZpQ95o4"
        }' \
     https://namestone.xyz/api/public_v1/claim-name