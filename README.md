## Notice: this project is in an alpha stage. It needs more testing

# SimpleSecrets
A K8S secrets manager operator.

[![Tests](https://github.com/Michaelpalacce/SimpleSecrets/actions/workflows/Tests.yml/badge.svg)](https://github.com/Michaelpalacce/SimpleSecrets/actions/workflows/Tests.yml)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7583adec8aca4c0a868fbf92ccd05706)](https://www.codacy.com/gh/Michaelpalacce/SimpleSecrets/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Michaelpalacce/SimpleSecrets&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/7583adec8aca4c0a868fbf92ccd05706)](https://www.codacy.com/gh/Michaelpalacce/SimpleSecrets/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Michaelpalacce/SimpleSecrets&utm_campaign=Badge_Coverage)

<img src="resources/favicon.png" width="150px" alt="">

### Note: This is just the API/Operator. Check the link below for the Frontend

## [Frontend Github Page](https://github.com/Michaelpalacce/SimpleSecretsFrontend)

A secure operator that gets installed in your kubernetes cluster and allows you to create 
secrets on demand. You can commit the SimpleSecrets which are nothing more than a reference to a database secret that will 
be created automatically for you. Targeted for HomeLab environments and not Enterprise.

Did you ever wonder, why am I paying AWS, Google, Microsoft, or why am I bothering with Hashicorp Vault when it's so unnecessarily 
heavy? Well look no further!

## Why SimpleSecrets?
1. You want to commit your code to git, but not your secrets
2. You are using HELM to provision your environment. Adding a secret to a helm chart means that chart cannot be committed to source
    control. Removing the secret's values also doesn't really work since you gotta keep a local copy instead and add it and remove it every time.
3. You don't want to pay money to cloud providers
4. You want all your data safely stored on your local environment inside the very same cluster that needs the secrets
5. It's simple to backup and restore 

## Roadmap
- [x] UI - For now I have provided a postman collection that you can use to access the operator -> https://github.com/Michaelpalacce/SimpleSecretsFrontend
- [x] Docker images with other database dependencies
- [x] 100% Test coverage ( I mean not exactly 100% but... I'll take it! )
- [x] Fingerprint in database for extra security
- [x] Api Documentation
- [x] Authentication -> Should be handled by a third party solution like authelia/authentik
- [ ] Better Backup & Restore procedure
- [ ] Kubernetes native way of storing backups -> using CRDs
- [ ] Dynamic secrets
- [ ] External secrets
- [ ] Watch secret annotation to restart deployments when a secret is changed
- [ ] Better Helm Chart
- [ ] Preserve annotations from SimpleSecret when creating the secret 

## Supported DBs:
| db            | Supported          | Comments                                                                                        |
|---------------|--------------------|-------------------------------------------------------------------------------------------------|
| sqlite3       | :heavy_check_mark: | Tested and working without any issue                                                            |
| PostgreSQL    | :heavy_check_mark: | Tested and working without any issue. Set the correct environment variables and it will work :) |
| MySQL         | :heavy_check_mark: | Tested and working without any issue. Set the correct environment variables and it will work :) |
| MariaDB       | :heavy_check_mark: | Tested and working without any issue. Set the correct environment variables and it will work :) |

## How does it work?
1. SimpleSecrets gets installed as a K8S operator in simplesecrets namespace.
2. During first start a new database file is created ( for sqlite3 )
3. During first start a new secret is created in the simplesecrets namespace containing the encryption key ( used to encrypt the secrets )
4. As a secondary measure a Fingerprint is generated and stored in the database, so if the secrets are ever exported and the encryption key is stolen, the fingerprint will be still preventing a decryption
5. Using the API, you create a new secret that will get stored in the database
6. Create a new SimpleSecret object, stating the version of the secret you want to use ( optional ) and a new secret will be created in the same namespace with the same name
7. If you change a SimpleSecret Object, like patch a version, the change will be reflected in the Secret. 
8. If you delete the SimpleSecret Resource, the Secret will also get deleted.

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

## Versioning
When creating a new secret with an api call, if that secret exists, a new version will be added. You can specify the version you want to use inside the SimpleSecret `spec`
~~~yaml
apiVersion: "simplesecrets.local/v1"
kind: SimpleSecret
metadata:
    name: testsecret
    namespace: simplesecrets
spec:
    version: 3 # The Operator will provision version 3 of the secret. If that version does not exist, a secret will not be created
~~~
If you want to use the latest version ALWAYS ( the K8S Secret will be recreated every time you create a new version with the API ),
then do not specify a version at all, or specify 0:
~~~yaml
apiVersion: "simplesecrets.local/v1"
kind: SimpleSecret
metadata:
    name: testsecret
    namespace: simplesecrets

---

apiVersion: "simplesecrets.local/v1"
kind: SimpleSecret
metadata:
    name: testsecret
    namespace: simplesecrets
spec:
    version: 0

~~~

## Env Variables

| Variable         | Description                                                                                                              | Default                     |
|------------------|--------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| APP_PORT         | The Port on which the app will run                                                                                       | 3000                        |
| ENCRYPTION_KEY   | Will be used in case there is no secret `encryptionkey` in `simplesecrets` namespace. If not provided, will be generated | undefined                   |
| DB_PATH          | The path to the sqlite3 database                                                                                         | `${PROJECT_ROOT}/db.sqlite` |
| PROD_DB_USERNAME | Check the available options from sequelize                                                                               | undefined                   |
| PROD_DB_PASSWORD | Check the available options from sequelize                                                                               | undefined                   |
| PROD_DB_NAME     | Check the available options from sequelize                                                                               | undefined                   |
| PROD_DB_HOSTNAME | Check the available options from sequelize                                                                               | undefined                   |
| PROD_DB_PORT     | Check the available options from sequelize                                                                               | undefined                   |
| PROD_DB_DIALECT  | Check the available options from sequelize                                                                               | undefined                   |

[//]: # (| INSECURE         | Should http requests to the API be accepted. Do not set this to true unless you know what you are doing                  | false                       |)


## Installation
1. Create namespace simplesecrets
2. (Optional) Create a new secret called `encryptionkey`. If you don't do this manually the secret will be generated for you.
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
### Checkout: [Working installation with Longhorn](https://github.com/Michaelpalacce/HomeLab/tree/master/Helm/apps/simplesecrets)

## Backup and Restore
* You can do a GET request to {{FQDN}}/api/simplesecrets/backup to get all the data needed for a backup
* You can do a POST request to {{FQDN}}/api/simplesecrets/restore with the data retrieved from /backup to do a full restore ( will overwrite your ENCRYPTION KEY and FINGERPRINT too )

## Development Pre-reqs
1. Have kubernetes context configured to connect to a kubernetes cluster
2. Run: `npm i`

## Development
1. Go to `./charts/`
2. Run `helm install simplesecrets simplesecrets -n simplesecrets --create-namespace`
3. in the main directory run `tsc --watch`
4. In the `./dist` directory run `nodemon index.js`

## Testing
1. Run: `npm run test`
2. Run: `npm run coverage` for test coverage
















