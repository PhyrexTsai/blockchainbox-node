# Blockchainbox-node

## How to start service

### Install node.js
```
brew install node

-- will use pm2 for starting server
npm install pm2 -g
```

### start ethereum RPC
```
geth --networkid 16888 --port 30303 --nodiscover --maxpeers 25 --nat "any" --rpc --rpccorsdomain "*" --rpcapi "eth,net,web3,debug" --mine --minerthreads 1 --autodag
```

### clone repository
```
git clone https://github.com/PhyrexTsai/blockchainbox-node.git
cd blockchainbox-node

-- start service
npm start
```

### Access on localhost
```
http://localhost:3000/ethereum/coinbase
http://localhost:3000/ethereum/balance
```

--

## TODO

- setup `cors` for whitelist hostnames
- put `npm install pm2 -g` in `ethereum/Dockerfile`
- pm2 with docker
    - http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/

- using worker on pm2
    - worker.js
        - run kafka consumer
