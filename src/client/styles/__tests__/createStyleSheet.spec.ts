import { Theme } from 'rsg-components/Styled';
import * as theme from '../theme';
import createStyleSheet from '../createStyleSheet';
import { StyleguidistConfig } from '../../../scripts/schemas/config';

const customThemeColor = '#123456';
const customThemeBorderColor = '#654321';
const customThemeMaxWidth = 9999;

const customStyleBorderColor = '#ABCDEF';

const testComponentName = 'TestComponentName';
const testRuleName = 'testRule';

const styles = ({ color, borderRadius, maxWidth }: Theme) => ({
	[testRuleName]: {
		color: color.base,
		backgroundColor: color.baseBackground,
		borderColor: color.border,
		borderRadius,
		maxWidth,
	},
});

const config: StyleguidistConfig = {
	theme: {
		color: {
			base: customThemeColor,
			border: customThemeBorderColor,
		},
		maxWidth: customThemeMaxWidth,
	},
	styles: {
		[testComponentName]: {
			[testRuleName]: {
				borderColor: customStyleBorderColor,
			},
		},
	},
};

describe('createStyleSheet', () => {
	it('should use theme variables', () => {
		const styleSheet = createStyleSheet(styles, config, testComponentName);
		const style = (styleSheet.getRule(testRuleName) as any).style;

		expect(style['background-color']).toBe(theme.color.baseBackground);
		expect(style['border-radius']).toBe(`${theme.borderRadius}px`);
	});

	it('should override theme variables with config theme', () => {
		const styleSheet = createStyleSheet(styles, config, testComponentName);
		const style = (styleSheet.getRule(testRuleName) as any).style;

		expect(style.color).toBe(customThemeColor);
		expect(style['max-width']).toBe(`${customThemeMaxWidth}px`);
	});

	it('should override config theme variables with config styles', () => {
		const styleSheet = createStyleSheet(styles, config, testComponentName);
		const style = (styleSheet.getRule(testRuleName) as any).style;

		expect(style['border-color']).toBe(customStyleBorderColor);
	});
});
