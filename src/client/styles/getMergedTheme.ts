import merge from 'lodash/merge';
import * as theme from './theme';
import { RecursivePartial } from '../../typings/RecursivePartial';
import * as Rsg from '../../typings';

export default function getMergedTheme(
	configTheme: Rsg.SanitizedStyleguidistConfig['theme']
): Rsg.Theme {
	return merge<RecursivePartial<Rsg.Theme>, Rsg.Theme, RecursivePartial<Rsg.Theme>>(
		{},
		theme,
		configTheme
	);
}
