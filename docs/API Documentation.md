# API Documentation

### GET /api/simplesecrets

curl --location -g --request GET '{{fqdn}}/api/simplesecrets'

Gets all the Secrets in all the namespaces

Response:
~~~json5
[
    {
        // DB ID
        "id": 1,
        
        // Secret Type
        "type": "Opaque",
        
        // Current Latest Version
        "version": "7",
        
        // Name of the secret ( this will be used as the actual name in k8s )
        "name": "test",
        
        // Namespace of the secret ( this will be used as the actual namespace in k8s )
        "namespace": "test",
        
        // Is this secret created in k8s
        "inUse": false,
        
        // DB Data
        "createdAt": "2022-03-30T20:08:55.597Z",
        "updatedAt": "2022-03-30T20:20:29.586Z"
    }
]
~~~

### GET /api/simplesecrets/:namespace:

curl --location -g --request GET '{{fqdn}}/api/simplesecrets/test'

Gets all the SimpleSecrets in the specific namespace. Response is the same as the Get All Method.

~~~json5
[
    {
        // DB ID
        "id": 1,
        
        // Secret Type
        "type": "Opaque",
        
        // Current Latest Version
        "version": "7",
        
        // Name of the secret ( this will be used as the actual name in k8s )
        "name": "test",
        
        // Namespace of the secret ( this will be used as the actual namespace in k8s )
        "namespace": "test",
        
        // Is this secret created in k8s
        "inUse": false,
        
        // DB Data
        "createdAt": "2022-03-30T20:08:55.597Z",
        "updatedAt": "2022-03-30T20:20:29.586Z"
    }
]
~~~

### GET /api/simplesecrets/:namespace:/:secretname:

curl --location -g --request GET '{{fqdn}}/api/simplesecrets/test/test'

Gets a specific SimpleSecret in a specific namespace. This also returns the decrypted data.

#### 200 Response -> When the SimpleSecret is found
~~~json5
{
    // DB ID
    "id": 1,
    // Decrypted Data
    "data": {
        "1": {
            "version": 1
        },
        "2": {
            "version": 2
        },
        "3": {
            "version": 3
        },
        "4": {
            "version": 2
        },
        "5": {
            "version": 5
        },
        "6": {
            "version": 6
        },
        "7": {
            "version": 1
        }
    },
    // Secret Type
    "type": "Opaque",
    
    // Current Latest Version
    "version": "7",
    
    // Name of the secret ( this will be used as the actual name in k8s )
    "name": "test",
    
    // Namespace of the secret ( this will be used as the actual namespace in k8s )
    "namespace": "test",
    
    // Is this secret created in k8s
    "inUse": false,
    
    // DB Data
    "createdAt": "2022-03-30T20:08:55.597Z",
    "updatedAt": "2022-03-30T20:20:29.586Z"
}
~~~

#### 404 Response -> When the SimpleSecret is not found
~~~json5
{
    "error": {
        "code": "app.general.simplesecret.notFound",
        "message": "Secret test1 not found in namespace: ( test )"
    }
}
~~~

### DELETE {{fqdn}}/api/simplesecrets/:namespace:/:secretname:

curl --location --request DELETE '{{fqdn}}/api/simplesecrets/simplesecrets/test'

Deletes the given secret in the given namespace.

#### 200 Response -> If the secret has been deleted successfully or the secret does not exist

### POST {{fqdn}}/api/simplesecrets

~~~bash
curl --location --request POST '{{fqdn}}/api/simplesecrets' \
--header 'Content-Type: application/json' \
--data-raw '{
    "namespace": "test",
    "name": "test",
    "type": "Opaque",
    "data": {
        "user": "test",
        "password": "test",
        "domain": "smtp.gmail.com",
        "port": "587"
    }
}'
~~~

Creates/Updates a secret. If the secret already exists, a new version will be created and the posted data will 
be added to the secret versions.

### 200 Response -> If created successfully
~~~json5
{
  // DB ID
  "id": 4,

  // Secret Type
  "type": "Opaque",

  // Current Latest Version
  "version": "1",

  // Name of the secret ( this will be used as the actual name in k8s )
  "name": "test",

  // Namespace of the secret ( this will be used as the actual namespace in k8s )
  "namespace": "test",

  // Is this secret created in k8s
  "inUse": false,

  // DB Data
  "updatedAt": "2022-04-15T22:13:47.881Z",
  "createdAt": "2022-04-15T22:13:47.881Z"
}
~~~









