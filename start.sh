nvm use 6 && npm install && npm run start
pm2 delete blockchainbox-consumer-insertQueue
pm2 delete blockchainbox-consumer-eventListener
pm2 delete blockchainbox-node
pm2 start blockchainbox-node.json
pm2 show blockchainbox-consumer-insertQueue
pm2 show blockchainbox-consumer-eventListener
pm2 show blockchainbox-node
pm2 save
