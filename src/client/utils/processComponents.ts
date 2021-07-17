import * as Rsg from '../../typings';

/**
 * Do things that are hard or impossible to do in a loader: we don’t have access to component name
 * and props in the styleguide-loader because we’re using `require` to load the component module.
 */
export default function processComponents(
	components: Rsg.RawComponent[],
	parentHashPath: string[] = []
): Rsg.Component[] {
	return components
		.filter((component) => !!component.props) // TODO: Why do we need this?
		.map((component) => ({
			...component,
			// Add .name shortcuts for names instead of .props.displayName.
			name: component.props.displayName,
			visibleName: component.props.visibleName || component.props.displayName,
			hashPath: [...parentHashPath, component.props.displayName],
		}));
}
