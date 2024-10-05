#!/bin/bash

curl -X POST \
     -H 'Content-Type: application/json' \
     -H 'Authorization: <auth code>' \
     -d '{
          "domain": "proofifi.eth",
          "name": "ipfs-test"
        }' \
     https://namestone.xyz/api/public_v1/delete-name