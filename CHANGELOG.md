## [3.0.1]
* Patching of SimpleSecrets that do not have any annotations now work as expected
* Added a bit of a better message for versions

## [3.0.0]
* Added badges
* Securing the services documentation
* Improvements to the helm chart
* Moved the Frontend to the API

## [2.1.0]
* Completely removed INSECURE
* Added API Documentation
* Removed sending of encrypted data for specific API calls ( get )
* Removed Delete All api call
* Added extra tests

## [2.0.2]
* Removed INSECURE

## [2.0.1]
* Fixed a bug with INSECURE

## [2.0.0]
* Removed unnecessary logs
* By default works over HTTPS only
* Generating of encryption keys is now more secure
* Added Fingerprint in the database, so data will be double encrypted and leaking the encryption key will not be enough.
* Fixed an issue with the migrations

## [1.15.0]
* Small improvements
* Documentation improvements
* Introduced docker-compose to test other databases
* Tested other databases, improved docker process for dependencies
* Added other Docker containers with dependencies to other databases

## [1.14.0]
* Documentation improvements
* Newer version of the UI

## [1.13.0]
* Improvements to the documentation
* Added more tests. 
* Test related fixes

## [1.12.0]
* Started working on tests and test coverage
* Removed obsolete code
* CI/CD for tests
* Fixed testing issues
