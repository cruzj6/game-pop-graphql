const Service = `
	type Query {
		Service(
			gameName: String!
			date: String!
			endDate: String
			serviceName: ServiceType
			maxResults: Int
		): [ServiceDataItem]
	}
`;

module.exports = Service;
