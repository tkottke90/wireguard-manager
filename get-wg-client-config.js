const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path')
const config = require('./wg0.json');

const { Interface, Peers } = config;
const [ ,, target ] = process.argv;

const peer = Peers.find(p => p.label.toLowerCase() === target.toLowerCase());

if (!peer) {
  console.error('\n=> Error: Peer does not exist');
  process.exit(1);
}

if (!peer.active) {
  console.error('\n=> Error: Peer is inactive, it wont be added to the server config');
  process.exit(1);
}

const PublicKey = readFileSync(resolve(__dirname, 'publickey'));
const output = `\r
[Interface]
# Client   - ${peer.label}
PrivateKey = 
ListenPort = ${peer.Port}
Address    = ${peer.AllowedIPs}
DNS        = 8.8.8.8, 1.1.1., 1.0.0.1

[Peer]
# Server            - ${Interface.Endpoint}
PublicKey           = ${PublicKey}
AllowedIps          = ${Interface.AllowedIPRange}
Endpoint            = ${Interface.Endpoint}:${Interface.ListenPort}
PersistentKeepalive = 25
`

writeFileSync(`./output/${peer.label}.conf`, output, { encoding: 'utf8' });
