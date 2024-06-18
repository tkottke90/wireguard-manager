const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path')
const config = require('./wg0.json');

let output = '';

const { Interface, Peers } = config;

const PrivateKey = readFileSync(resolve(__dirname, 'privatekey'));

output += `
#
# Wireguard Configuration #
# 
#   Created from: create-wg-config.mjs
#   Author: Thomas Kottke <t.kottke90@gmail.com
#
#   Date: ${new Date().toISOString()}
#

#  WARNING: Dont update file directly.  I am storing meta data about
#  the configuration in the wg0.json file.  Use scripts to work with
#  the data.

[Interface]
PrivateKey = ${PrivateKey}
Address    = ${Interface.Address}
ListenPort = ${Interface.ListenPort}
PostUp     = ${Interface.PostUp}
SaveConfig = ${Interface.SaveConfig}


`

Peers
  .filter(peer => peer.active)
  .forEach(peer => {
    output += `\r
[Peer]
# ${peer.label} - ${peer.tags.join(',')}
PublicKey  = ${peer.PublicKey}
AllowedIPs = ${peer.AllowedIPs}
Endpoint   = ${peer.Address}:${peer.Port}
`
})


writeFileSync('./output/wg0.conf', output, { encoding: 'utf8' });
