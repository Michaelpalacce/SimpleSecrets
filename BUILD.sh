VERSION=1.0.4

# Build actual image with ready binaries
docker buildx build --platform linux/amd64,linux/arm64 \
-t stefangenov/simplesecrets:latest \
-t stefangenov/simplesecrets:"${VERSION}" \
--build-arg TAG_VERSION="${VERSION}" \
-f Dockerfile \
--cpu-quota="600000" \
--memory=16g \
--push .

