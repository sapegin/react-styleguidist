import React, { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default function Stub({ children }: Props) {
	return <>{children}</>;
}
