// In the future, the database will be structured as: namespace -> simplesecret name -> encrypted values
const db	= {
	simplesecrets: {
		testsecret: {
			type: "Opaque",
			data: {
				secretOne: 'SecretOneValue',
				secretTwo: "2",
			}
		}
	}
};

export default db;