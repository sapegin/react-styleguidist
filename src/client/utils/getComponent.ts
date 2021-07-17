import { ComponentType } from 'react';

interface DefaultExport {
	default: unknown;
}

function isDefaultExport(module: any): module is DefaultExport {
	return !!module.default;
}

/**
 * Given a component module and a name, return the appropriate export.
 * See /docs/Components.md
 */
export default function getComponent(module: any, name?: string): ComponentType {
	//
	// If the module defines a default export, return that
	// e.g.
	//
	// ```
	// export default function Component() { ... }
	// ```
	//
	if (isDefaultExport(module)) {
		return module.default as ComponentType;
	}

	// If it is a CommonJS module which exports a function, return that
	// e.g.
	//
	// ```
	// function Component() { ... }
	// module.exports = Component;
	// ```
	//
	if (!module.__esModule && typeof module === 'function') {
		return module as ComponentType;
	}

	// If the module exports just one named export, return that
	// e.g.
	//
	// ```
	// export function Component() { ... }
	// ```
	//
	const namedExports = Object.keys(module);
	if (namedExports.length === 1) {
		return module[namedExports[0]] as ComponentType;
	}

	// If the module exports a named export with the same name as the
	// understood Component identifier, return that
	// e.g.
	//
	// ```
	// // /component.js
	// export function someUtil() { ... }
	// export Component() { ... } // if identifier is Component, return this named export
	// ```
	//
	// Else return the module itself
	//
	return (
		(name ? (module[name] as ComponentType) : undefined) || ((module as unknown) as ComponentType)
	);
}
