// Inspired by https://github.com/camwest/react-slot-fill

import React from 'react';
import PropTypes from 'prop-types';
import { useStyleGuideContext } from 'rsg-components/Context';

interface SlotProps {
	name: string;
	active?: string;
	onlyActive?: boolean;
	props?: {
		onClick?: (id: string, ...attrs: any[]) => void;
		active?: boolean;
		name?: string;
		[propId: string]: any;
	};
	className?: string;
}

export default function Slot({ name, active, onlyActive, className, props = {} }: SlotProps) {
	const { slots } = useStyleGuideContext();
	const fills = slots[name];
	if (!fills) {
		throw new Error(`Slot "${name}" not found, available slots: ${Object.keys(slots).join(', ')}`);
	}

	const rendered = fills.map((Fill, index) => {
		let fillProps = props;
		if ('id' in Fill && 'render' in Fill) {
			// { id: 'pizza', render: ({ foo }) => <div>{foo}</div> }
			const { id, render } = Fill;
			// Render only specified fill
			if (onlyActive && id !== active) {
				return null;
			}

			// eslint-disable-next-line react/prop-types
			const { onClick } = props;
			fillProps = {
				...props,
				name: id,
				// Set active prop to active fill
				active: active ? id === active : undefined,
				// Pass fill ID to onClick event handler
				onClick: onClick && ((...attrs) => onClick(id, ...attrs)),
			};
			const Render = render;
			return <Render key={index} {...fillProps} />;
		}
		return <Fill key={index} {...fillProps} />;
	});

	const filtered = rendered.filter(Boolean);
	if (filtered.length === 0) {
		return null;
	}

	return <div className={className}>{filtered}</div>;
}

Slot.propTypes = {
	name: PropTypes.string.isRequired,
	active: PropTypes.string,
	onlyActive: PropTypes.bool,
	props: PropTypes.object,
	className: PropTypes.string,
};
