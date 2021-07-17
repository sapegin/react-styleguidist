import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'rsg-components/Slot';
import SectionHeadingRenderer from 'rsg-components/SectionHeading/SectionHeadingRenderer';
import { getIsolatedUrl, getSectionUrl } from '../../utils/getUrl';

export const getIsolatedButtonUrl = ({
	isolated,
	pagePerSection,
	slug,
	hashPath,
}: {
	isolated: boolean;
	pagePerSection: boolean;
	slug: string;
	hashPath: string[];
}) => {
	if (isolated) {
		return getSectionUrl({ pagePerSection, slug, hashPath });
	} else {
		return getIsolatedUrl(hashPath);
	}
};

interface SectionHeadingProps {
	name: string;
	slotName: string;
	depth: number;
	slug: string;
	hashPath: string[];
	deprecated?: boolean;
	pagePerSection: boolean;
	isolated: boolean;
	children?: React.ReactNode;
}

const SectionHeading: React.FunctionComponent<SectionHeadingProps> = ({
	slotName,
	children,
	name,
	slug,
	hashPath,
	pagePerSection,
	isolated,
	...rest
}) => {
	return (
		<SectionHeadingRenderer
			toolbar={
				<Slot
					name={slotName}
					props={{
						name,
						isolated,
						href: getIsolatedButtonUrl({ isolated, pagePerSection, slug, hashPath }),
					}}
				/>
			}
			id={slug}
			href={getSectionUrl({ pagePerSection, slug, hashPath })}
			{...rest}
		>
			{children}
		</SectionHeadingRenderer>
	);
};

SectionHeading.propTypes = {
	name: PropTypes.string.isRequired,
	slotName: PropTypes.string.isRequired,
	depth: PropTypes.number.isRequired,
	slug: PropTypes.string.isRequired,
	hashPath: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
	deprecated: PropTypes.bool,
	pagePerSection: PropTypes.bool.isRequired,
	isolated: PropTypes.bool.isRequired,
	children: PropTypes.node,
};

export default SectionHeading;
