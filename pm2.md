## pm2

### CI config
```
nvm use 6 && npm install && npm run build:prod
pm2 delete jetty
pm2 start /etc/pm2/conf.d/jetty.json
pm2 show jetty
pm2 save
```

### pm2 JSON

```
{
  apps : [{
    name        : "worker",
    script      : "./producer.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "api-app",
    script     : "./api.js",
    instances  : 4,
    exec_mode  : "cluster"
  }]
}
```

### npm package json

```
{
  "name": "bikini",
  "version": "1.2.1",
  "description": "The new tiny and sexy mobile web",
  "private": true,
  "scripts": {
    "prestart": "npm run build:prod",
    "start": "NODE_ENV=production node bin/server.js",
    "predev": "npm run build:dev",
    "dev": "NODE_ENV=development nodemon bin/server.js",
    "build": "npm run clean && webpack --progress --verbose --display-error-details --bail",
    "build:dev": "NODE_ENV=development npm run build --",
    "build:prod": "NODE_ENV=production npm run build --",
    "lint": "npm run eslint && npm run stylelint",
    "eslint": "eslint --ext .js,.jsx .",
    "stylelint": "stylelint \"app/**/*.css\"",
    "clean": "rimraf public",
    "ava": "NODE_ENV=test ava '**/*.spec.js'",
    "pretest": "mkdir public | echo ''",
    "test": "NODE_ENV=test nyc --require babel-register --all npm run ava",
    "codecov": "nyc report --reporter=json && codecov -f coverage/*.json",
    "storybook": "start-storybook -p 9000",
    "release": "release-it",
    "release-minor": "npm run release -- minor",
    "release-major": "npm run release -- major"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/migme/bikini.git"
  },
```

