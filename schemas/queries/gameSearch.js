const GameSearch = `
	type Query {
		GameSearch(
			searchTerms: String!
			serviceName: ServiceType
		): [ServiceDataItem]
	}
`;

module.exports = GameSearch;
