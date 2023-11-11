Remove-Item layer -Recurse -ErrorAction Ignore
mkdir -p layer/nodejs
cp -r ./node_modules ./layer/nodejs
cp package.json ./layer/nodejs