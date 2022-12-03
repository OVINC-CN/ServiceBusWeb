# install pnpm & dependency
npm install -g pnpm
pnpm install

# backup
cp src/context/index.js src/context/index.js.bak

# build
SITE_URL=$1
BACKEND_URL=$2
echo $SITE_URL
echo $BACKEND_URL
sed -i '' 's/process.env.SITE_URL/'"'${SITE_URL}'"'/g' src/context/index.js
sed -i '' 's/process.env.BACKEND_URL/'"'${BACKEND_URL}'"'/g' src/context/index.js
pnpm run build

# backup
mv src/context/index.js.bak src/context/index.js
