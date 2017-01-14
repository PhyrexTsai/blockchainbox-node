# Blockchainbox-node
  
Write by node.js, handle the ethereum web3.js.
Contains:  
- Kafka consumer
- Kafka producer
- web3.js proxy
- Event listener worker

## How to start service

### Install node.js
```
brew install node

-- install nvm
npm install nvm

-- install node version 6+
nvm install 6.9.1

-- will use pm2 for starting server
npm install pm2 -g
```

### Install Solidity

- Documents: http://solidity.readthedocs.io/en/latest/installing-solidity.html
- Node.js

```
npm install solc
```

- Mac OS
```
brew update
brew upgrade
brew tap ethereum/ethereum
brew install solidity
brew linkapps solidity
```

### start ethereum RPC
```
geth --networkid 16888 --port 30303 --nodiscover --maxpeers 25 --nat "any" --rpc --rpccorsdomain "*" --rpcapi "eth,net,web3,debug" --mine --minerthreads 1 --autodag
```

### clone repository
```
git clone https://github.com/PhyrexTsai/blockchainbox-node.git
cd blockchainbox-node

-- start service with pm2
./start.sh
```
### Unlock your account
```
geth attach
personal.unlockAccount('4c25526a6b567c067396bd1fe0a1936117875436','password',600000);
 
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

- using kafka on pm2
    - insertQueueConsumer.js
        - run kafka consumer
