#!/bin/bash

cd client
npm i -g yarn 
yarn
npm run build 
rm -rf node_modules 
rm -rf src 
rm -rf public 
cd ../server 
yarn
