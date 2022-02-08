VERSION=0.1.0

docker buildx build --platform linux/amd64,linux/arm64 \
-t stefangenov/simplesecrets:latest \
-t stefangenov/simplesecrets:"${VERSION}" \
-f Dockerfile \
--build-arg TAG_VERSION="${VERSION}" \
--cpu-quota="600000" \
--memory=16g \
--push .
