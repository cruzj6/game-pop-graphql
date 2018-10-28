const GameForService = `
	type Query {
		GameForService(
			gameName: String!
			startDate: String!
			endDate: String
			serviceName: ServiceType
			maxResults: Int
		): [ServiceDataItem]
	}
`;

module.exports = GameForService;
