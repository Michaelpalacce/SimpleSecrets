# SimpleSecrets

A K8S secrets manager operator. 


## Example:
After adding the SimpleSecret, create an empty SimpleSecret object:
~~~yaml
apiVersion: "simplesecrets.local/v1"
kind: SimpleSecret
metadata:
    name: testsecret
    namespace: simplesecrets
~~~
This will automatically resolve to:
~~~yaml
apiVersion: v1
kind: Secret
metadata:
    name: testsecret
    namespace: simplesecrets
    annotations:
        "simplesecrets.hash": {{HASH_VALUE}}
data:
    dataOne: {{BASE_64_VALUE}}
    dataTwo: {{BASE_64_VALUE}}
~~~

## Env Variables

~~~
DB_CONNECTION_STRING    -> Sequelize DB Connection string
~~~


## Development Pre-reqs
1. Have kubectl installed and have it configured to connect to the k8s cluster ( admin.yaml file )
2. Run: `npm i`

## Development
1. Go to `./charts/`
2. Run `helm install simplesecrets simplesecrets -n simplesecrets --create-namespace`
3. in the main directory run `tsc --watch`
4. In the `./dist` directory run `nodemon index.js`


















