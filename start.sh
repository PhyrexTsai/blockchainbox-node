nvm use 6 && npm install && npm run start
pm2 delete blockchainbox-worker
pm2 delete blockchainbox-node
pm2 start blockchainbox-node.json
pm2 show blockchainbox-worker
pm2 show blockchainbox-node
pm2 save