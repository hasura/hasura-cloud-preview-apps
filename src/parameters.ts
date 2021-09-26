import * as core from '@actions/core'
import { errors } from './errors'

export const validateParameters = (params: Record<string, string>) => {
	if (!params.NAME) {
		throw new Error(errors.validation.name);
	}
}

export const parameters: Record<string, string> = {
	PLAN: core.getInput('plan') || 'cloud_free',
	REGION: core.getInput('region') || 'us-east-2',
	NAME: core.getInput('name') || '',
};

export const getParameters = () => {
	validateParameters(parameters);
	return parameters;
};
