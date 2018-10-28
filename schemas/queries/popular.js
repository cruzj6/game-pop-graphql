const Popular = `
	type Query {
		Popular(
			serviceName: ServiceType
		): [ServiceDataItem]
	}
`;

module.exports = Popular;
