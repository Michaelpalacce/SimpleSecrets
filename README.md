# SimpleSecrets

A K8S secrets manager operator

## Development Pre-reqs
1. Have kubectl installed and have it configured to connect to the k8s cluster ( admin.yaml file )
2. Run: `npm i`

## Development
1. Go to `./charts/`
2. Run `helm install simplesecrets simplesecrets -n simplesecrets --create-namespace`
3. in the main directory run `tsc --watch`
4. In the `./dist` directory run `nodemon index.js`


















