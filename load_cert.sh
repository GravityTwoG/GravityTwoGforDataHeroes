#!/bin/bash
mkdir -p ~/.postgresql

# https://stackoverflow.com/questions/71489336/how-do-you-use-wget-in-repl-it-bash
curl "https://storage.yandexcloud.net/cloud-certs/CA.pem" \
    --output ~/.postgresql/root.crt

chmod 0600 ~/.postgresql/root.crt
