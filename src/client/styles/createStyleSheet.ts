import merge from 'lodash/merge';
import memoize from 'lodash/memoize';
import { Styles, StyleSheet } from 'jss';
import jss from './setupjss';
import getMergedTheme from './getMergedTheme';
import * as Rsg from '../../typings';

/**
 * By default lodash/memoize only uses the first argument
 * for cache rendering. It works well if the first prameter
 * is enough.
 * We are Hot Module Replacing (HMR) stylesheets.
 * Therefore, we cannot cache stylesheet only by component.
 * We need to add cssRevisions to the key fo when the css files update,
 * the revision will update and we should update the stylesheet.
 */
export default memoize(
	(
		styles: (t: Rsg.Theme) => Styles<string>,
		config: Rsg.ProcessedStyleguidistCSSConfig,
		componentName: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		cssRevision: string
	): StyleSheet<string> => {
		const mergedTheme = getMergedTheme(config.theme);

		const customStyles =
			typeof config.styles === 'function' ? config.styles(mergedTheme) : config.styles;

		const mergedStyles: Styles<string> = merge(
			{},
			styles(mergedTheme),
			customStyles && customStyles[componentName]
		);

		return jss.createStyleSheet(mergedStyles, { meta: componentName, link: true });
	},
	// calculate the cache key here
	(styles, config, componentName, cssRevision) => `${componentName}_${cssRevision}`
);
