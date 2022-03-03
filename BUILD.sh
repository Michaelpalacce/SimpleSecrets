VERSION=$(curl -s -XGET https://api.github.com/repos/Michaelpalacce/SimpleSecrets/tags | grep name -m 1 | awk '{print $2}' | cut -d'"' -f2)

## Build actual image with ready binaries
docker buildx build --platform linux/amd64,linux/arm64 \
-t stefangenov/simplesecrets:latest \
-t stefangenov/simplesecrets:latest-sqlite3 \
-t stefangenov/simplesecrets:"${VERSION}" \
-t stefangenov/simplesecrets:"${VERSION}-sqlite3" \
--build-arg TAG_VERSION="${VERSION}" \
-f Dockerfile.sqlite \
--cpu-quota="600000" \
--memory=16g \
--push .

# Build actual image with ready binaries
docker buildx build --platform linux/amd64,linux/arm64 \
-t stefangenov/simplesecrets:latest-postgresql \
-t stefangenov/simplesecrets:"${VERSION}-postgresql" \
--build-arg TAG_VERSION="${VERSION}" \
-f Dockerfile.postgresql \
--cpu-quota="600000" \
--memory=16g \
--push .

# Build actual image with ready binaries
docker buildx build --platform linux/amd64,linux/arm64 \
-t stefangenov/simplesecrets:latest-mariadb \
-t stefangenov/simplesecrets:"${VERSION}-mariadb" \
--build-arg TAG_VERSION="${VERSION}" \
-f Dockerfile.mariadb \
--cpu-quota="600000" \
--memory=16g \
--push .

# Build actual image with ready binaries
docker buildx build --platform linux/amd64,linux/arm64 \
-t stefangenov/simplesecrets:latest-mysql2 \
-t stefangenov/simplesecrets:"${VERSION}-mysql2" \
--build-arg TAG_VERSION="${VERSION}" \
-f Dockerfile.mysql2 \
--cpu-quota="600000" \
--memory=16g \
--push .

