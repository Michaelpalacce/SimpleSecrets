## Notice: this project is in an alpha stage. It needs more testing

# SimpleSecrets

A K8S secrets manager operator. A secure operator that gets installed in your kubernetes cluster and allows you to create 
secrets on demand. This way you can commit your SimpleSecrets to source control without having to worry about them actually being exposed.
Did you ever wonder, why am I paying AWS, Google, Microsoft, or why am I bothering with Hashicorp Vault when it's so unnecessarily 
heavy? Well look no further!

## Use Cases
1. You want to commit your code to git, but not your secrets
2. You are using HELM to provision your environment. Adding a secret to a helm chart doesn't really work, since your secrets will be exposed in the git repo.
3. You don't want to pay money to cloud providers
4. You want all your data safely stored on your local environment

## Roadmap
- [ ] UI - For now I have provided a postman collection that you can use to access the operator
- [ ] Tests
- [ ] Authentication 
- [ ] Multiple Users

## How does it work?
1. SimpleSecrets gets installed as a K8S operator in simplesecrets namespace.
2. During first start a new database file is created ( for sqlite3 )
3. During first start a new secret is created in the simplesecrets namespace containing the encryption key ( used to encrypt the secrets )
4. Using the API, you create a new secret that will get stored in the database
5. Create a new SimpleSecret object, stating the version of the secret you want to use ( optional ) and a new secret will be created in the same namespace with the same name
6. If you do changes to the SimpleSecret Resource, like patch a version, the changes will be reflected in the Secret. 
7. If you delete the SimpleSecret Resource, the Secret will also get deleted.

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
APP_PORT                -> Port the app should be running on
DB_PATH                 -> ABSOLUTE path to the DB file ( for sqlite3 )
~~~

## Installation
1. Create namespace simplesecrets
2. (Optional) Create a new secret called encryptionkey. If you don't do this manually the secret will be generated for you.
3. Apply the Helm charts in simplesecrets namespace
~~~yaml
apiVersion: v1
kind: Secret
metadata:
    name: encryptionkey
    namespace: simplesecrets
data:
    encryptionKey: {{BASE_64_VALUE}}
~~~

## Development Pre-reqs
1. Have kubectl installed and have it configured to connect to the k8s cluster ( admin.yaml file )
2. Run: `npm i`

## Development
1. Go to `./charts/`
2. Run `helm install simplesecrets simplesecrets -n simplesecrets --create-namespace`
3. in the main directory run `tsc --watch`
4. In the `./dist` directory run `nodemon index.js`


















