import React from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import SectionHeading from 'rsg-components/SectionHeading';
import Markdown from 'rsg-components/Markdown';
import * as Rsg from '../../../typings';

const styles = ({ space }: Rsg.Theme) => ({
	root: {
		marginBottom: space[4],
	},
});

interface SectionRendererProps extends JssInjectedProps {
	slug: string;
	depth: number;
	name: string;
	description?: string;
	content?: React.ReactNode;
	components?: React.ReactNode;
	sections?: React.ReactNode;
	isolated: boolean;
	pagePerSection: boolean;
	hashPath: string[];
}

export const SectionRenderer: React.FunctionComponent<SectionRendererProps> = ({
	classes,
	name,
	slug,
	content,
	components,
	sections,
	depth,
	description,
	pagePerSection,
	isolated,
	hashPath,
}) => {
	return (
		<section className={classes.root} data-testid={`section-${slug}`}>
			{name && (
				<SectionHeading
					name={name}
					slug={slug}
					hashPath={hashPath}
					pagePerSection={pagePerSection}
					isolated={isolated}
					depth={depth}
					slotName="sectionToolbar"
				>
					{name}
				</SectionHeading>
			)}
			{description && <Markdown text={description} />}
			{content}
			{sections}
			{components}
		</section>
	);
};

SectionRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	slug: PropTypes.string.isRequired,
	content: PropTypes.node,
	components: PropTypes.node,
	sections: PropTypes.node,
	isolated: PropTypes.bool.isRequired,
	depth: PropTypes.number.isRequired,
	pagePerSection: PropTypes.bool.isRequired,
};

export default Styled<SectionRendererProps>(styles)(SectionRenderer);
