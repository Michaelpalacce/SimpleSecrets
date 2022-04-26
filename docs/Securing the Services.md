# Securing the data

The data is stored in an SQLite database ( by default ) and all data is encrypted at rest.

# Securing the Backend

**NOTE: THIS IS A WIP. THE FRONTEND IS NOT YET MODIFIED FOR THIS TO BE POSSIBLE**
Security of the backend pod is controlled via kubernetes native network policies. These are CNI dependent and must be configured
separately. They should follow these principles:
Ingress traffic is restricted only from the frontend app.
(Optionally) Egress traffic is restricted only to the kubernetes svc.
Example Network Policies can be found in the Helm chart

# Securing the Frontend

The Frontend has no security configured as of now. The recommendation here is to:
1. Proxy the connection ONLY when needed
2. Use Third-Party reverse proxy authentication services ( Authelia, Authentik... )