#!/bin/bash

cd client 
npm i 
npm run build 
rm -rf node_modules 
rm -rf src 
rm -rf public 
cd ../server 
npm i
