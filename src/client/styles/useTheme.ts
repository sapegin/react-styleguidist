import { useStyleGuideContext } from 'rsg-components/Context';
import getMergedTheme from './getMergedTheme';
import * as Rsg from '../../typings';

export default function useTheme(): Rsg.Theme {
	const {
		config: { theme },
	} = useStyleGuideContext();
	return getMergedTheme(theme);
}
