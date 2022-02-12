VERSION=$(curl -s -XGET https://api.github.com/repos/Michaelpalacce/SimpleSecrets/tags | grep name -m 1 | awk '{print $2}' | cut -d'"' -f2)

# Build actual image with ready binaries
docker buildx build --platform linux/amd64,linux/arm64 \
-t stefangenov/simplesecrets:latest \
-t stefangenov/simplesecrets:latest-sqlite3 \
-t stefangenov/simplesecrets:"${VERSION}" \
-t stefangenov/simplesecrets:"${VERSION}-sqlite3" \
--build-arg TAG_VERSION="${VERSION}" \
-f Dockerfile \
--cpu-quota="600000" \
--memory=16g \
--push .

