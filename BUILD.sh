VERSION=1.0.3

# Build Only for AMD ( arm takes 30 minutes, cause frick python )
docker build \
-t stefangenov/simplesecretsbuild:latest \
-t stefangenov/simplesecretsbuild:"${VERSION}" \
-f Dockerfile.builder .

# Push the image ( buildx does not use local images )
docker push stefangenov/simplesecretsbuild:latest
docker push stefangenov/simplesecretsbuild:"${VERSION}"

# Build actual image with ready binaries
docker buildx build --platform linux/amd64,linux/arm64 \
-t stefangenov/simplesecrets:latest \
-t stefangenov/simplesecrets:"${VERSION}" \
--build-arg TAG_VERSION="${VERSION}" \
-f Dockerfile \
--cpu-quota="600000" \
--memory=16g \
--push .

