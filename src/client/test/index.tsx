import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import config from '../../scripts/schemas/config';
import slots from '../rsg-components/slots';
import Context, { StyleGuideContextContents } from '../rsg-components/Context';

const compileExample = config.compileExample.default;

type PartialContext = Partial<Omit<StyleGuideContextContents, 'config'>> & {
	config?: Partial<StyleGuideContextContents['config']>;
};

const defaultContext: PartialContext = {
	config: {
		theme: {},
		styles: {},
		pagePerSection: false,
		tocMode: 'expand',
		compileExample,
	},
	isolated: false,
	slots: slots(),
};

export const Provider = ({
	children,
	...props
}: PartialContext & { children: React.ReactNode }) => (
	<Context.Provider value={{ ...defaultContext, ...props } as StyleGuideContextContents}>
		{children}
	</Context.Provider>
);

const Wrapper: React.FC = ({ children }) => {
	return <Provider>{children}</Provider>;
};

// Render a component with all the necessary providers
const customRender = (ui: React.ReactElement, options: RenderOptions = {}): RenderResult => {
	return render(ui, {
		wrapper: Wrapper,
		...options,
	});
};

// Keep the API of React Testing Library but with our custom renderer
export {
	act,
	fireEvent,
	screen,
	getNodeText,
	getRoles,
	isInaccessible,
	logDOM,
	logRoles,
	waitForElementToBeRemoved,
	within,
} from '@testing-library/react';
export { customRender as render };
