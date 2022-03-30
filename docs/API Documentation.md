# API Documentation

### GET /api/simplesecrets

curl --location -g --request GET '{{fqdn}}/api/simplesecrets'

Gets all the Secrets

Response:
~~~json5
[
  {
    // DB ID
    "id": 1, 
    
    // Encrypted Data
    "data": "ieNr6nbDqMaAxVkNf90LRFSDkdrpNz3U0kWx4zL43HefJxvPL/z6YMUpp6/AdcdFRxMui8s6rGuJEulFr6YCM/9hS4WwhyyJFfdrMsmfVBSXdICYwhijemDRBz4H6MpLTUHCWEni7AByr/jo5p0bEjTatgp7Is7L8u//yPXF1TnnQRZQLIp3a8+3KGxrq8BsRgUFwAa4lPsBpII86XC8XlMKVaZQ7l31tQVmK1/9Z7w3P0X2BnLXlZsJUkVhSc5DiPZKcZkHHARYrXJ5lI1U7ETzc+1LyJldsckd+6h6P4lsGArjIb0Y9dP/E5M=",
   
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
