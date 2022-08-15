# Working With SimpleSecrets

## Creating a new SimpleSecret
First visit the UI and create a new SimpleSecret by clicking the `New Secret` button on the sidebar.
Let's say this is the body of the secret:
```json
{
    "dataOne":"value",
    "dataTwo":"value2"
}
```

> Be mindful of namespace name limitations as well as other naming limitations that Kubernetes enforces.
> e.g. namespaces cannot have capital letters.

After adding the SimpleSecret, create an empty SimpleSecret object like so
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
    dataOne: dmFsdWU=
    dataTwo: dmFsdWUy
~~~

## Versioning
When creating a new SimpleSecret with an api call, if that SimpleSecret exists, a new version will be added. You can specify
the version you want to use inside the SimpleSecret `spec` like so:
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
    name: testsecret2
    namespace: simplesecrets
spec:
    version: 0
~~~

## Annotations
There may be cases where you wish to add annotations to secrets. In this case, you can specify your annotations in the SimpleSecret
and they will automatically be added to the secret from then on.

~~~yaml
apiVersion: "simplesecrets.local/v1"
kind: SimpleSecret
metadata:
    name: testsecret
    namespace: simplesecrets
    annotations:
        myAnnotation: "123"
~~~

This will equal to:
~~~yaml
apiVersion: v1
kind: Secret
metadata:
    name: testsecret
    namespace: simplesecrets
    annotations:
        "simplesecrets.hash": {{HASH_VALUE}}
        myAnnotation: "123"
data:
    dataOne: dmFsdWU=
    dataTwo: dmFsdWUy
~~~