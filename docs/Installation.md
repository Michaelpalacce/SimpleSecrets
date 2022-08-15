# Installation
1. Create namespace simplesecrets ( this cannot be changed )
2. (Optional) Create a new secret called `encryptionkey`. If you don't do this manually the secret will be generated for you. Example:
    ~~~yaml
    apiVersion: v1
    kind: Secret
    metadata:
        name: encryptionkey
        namespace: simplesecrets
    data:
        encryptionKey: {{BASE_64_VALUE}}
    ~~~
3. Apply the Helm charts in simplesecrets namespace

### Checkout: [Working installation with Longhorn](https://github.com/Michaelpalacce/HomeLab/tree/master/Helm/apps/simplesecrets)