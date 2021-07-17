import React from 'react';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import { MdInfoOutline } from 'react-icons/md';
import Text from 'rsg-components/Text';
import Tooltip from 'rsg-components/Tooltip';
import * as Rsg from '../../../typings';

export const styles = ({ space }: Rsg.Theme) => ({
	complexType: {
		alignItems: 'center',
		display: 'inline-flex',
	},
	name: {
		flexShrink: 0,
	},
	icon: {
		marginLeft: space[0],
		flexShrink: 0,
	},
});

export interface ComplexTypeProps extends JssInjectedProps {
	name: string;
	raw: string;
}

function ComplexTypeRenderer({ classes, name, raw }: ComplexTypeProps) {
	return (
		<Tooltip placement="right" content={raw}>
			<span className={classes.complexType}>
				<span className={classes.name}>
					<Text>{name}</Text>
				</span>
				<MdInfoOutline className={classes.icon} />
			</span>
		</Tooltip>
	);
}

export default Styled<ComplexTypeProps>(styles)(ComplexTypeRenderer);
