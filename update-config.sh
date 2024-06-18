#! /bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

echo "> Updating Local Conf File"
/home/tkottke/.nvm/versions/node/v16.15.1/bin/node create-wg-config.js

echo "> Shutting Down Wireguard"
wg-quick down wg0

echo "> Updating Config"
cp output/wg0.conf /etc/wireguard

echo "> Restarting Server"
wg-quick up wg0
