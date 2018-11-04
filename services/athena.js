const AWS = require('aws-sdk');
const _ = require('lodash/fp');
const logger = require('../services/logger');
const constants = require('../constants');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const POPULAR_TIME_SPAN_DAYS = 7;
const MAX_POPULAR = 50;

const athena = new AWS.Athena({
	endpoint: process.env.AWS_ATHENA_URL,
});

const getQueryStringForTopGames = (startTime, endTime) => `
	SELECT gamename, greatest(viewers) as viewers, posted FROM twitcheverything
	WHERE posted BETWEEN ${startTime} AND ${endTime}
	ORDER BY viewers DESC
`;

const getExecutionStatus = async (QueryExecutionId) => {
	const result = await athena.getQueryExecution({
		QueryExecutionId,
	}).promise();

	return result.QueryExecution;
};

const waitForAthenaQueryExecution = QueryExecutionId => new Promise(async (resolve, reject) => {
	const result = await getExecutionStatus(QueryExecutionId);
	const { Status: { State, StateChangeReason } } = result;

	switch (State) {
	case constants.ATHENA_QUERY_STATES.SUCCEEDED:
		resolve();
		break;
	case constants.ATHENA_QUERY_STATES.CANCELLED:
	case constants.ATHENA_QUERY_STATES.FAILED:
		reject(StateChangeReason);
		break;
	default: {
		await new Promise(res => setTimeout(res, 1000));
		await waitForAthenaQueryExecution(QueryExecutionId);
		resolve();
	}
	}
});

const columnIndexGetterFromQueryResults = results => name => (
	_.findIndex(({ Name }) => Name === name, results.ResultSet.ResultSetMetadata.ColumnInfo)
);

const curriedSplice = (...args) => (arr = []) => arr.splice(...args);

const normalizePopularQueryResults = (results) => {
	const getColumnIndex = columnIndexGetterFromQueryResults(results);
	const viewersIndex = getColumnIndex('viewers');
	const postedIndex = getColumnIndex('posted');
	const gameNameIndex = getColumnIndex('gamename');

	return _.flowRight(
		curriedSplice(0, MAX_POPULAR),
		_.uniqBy('gamename'),
		_.map(({ Data }) => {
			const viewers = Data[viewersIndex].VarCharValue;
			const posted = Data[postedIndex].VarCharValue;
			const gamename = Data[gameNameIndex].VarCharValue;

			return {
				viewers: _.toString(viewers),
				posted: _.toString(posted),
				gamename,
			};
		}),
		curriedSplice(1),
	)(results.ResultSet.Rows);
};

const getPopular = async () => {
	try {
		const date = new Date();
		date.setDate(date.getDate() - POPULAR_TIME_SPAN_DAYS);

		const endingDate = Date.now();
		const statingDate = date.getTime();

		const { QueryExecutionId } = await athena.startQueryExecution({
			QueryString: getQueryStringForTopGames(statingDate, endingDate),
			ResultConfiguration: {
				OutputLocation: constants.AWS_ATHENA.S3_RESULTS_URL,
			},
			QueryExecutionContext: {
				Database: constants.AWS_ATHENA.DATABASE_NAME,
			},
		}).promise();

		await waitForAthenaQueryExecution(QueryExecutionId);

		const results = await athena.getQueryResults({ QueryExecutionId }).promise();
		const normalizedResults = normalizePopularQueryResults(results);

		return normalizedResults;
	} catch (e) {
		logger.error(e);
		return [];
	}
};

module.exports = {
	getPopular,
};
