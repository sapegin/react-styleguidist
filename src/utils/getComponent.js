/**
 * Given a component module and a name,
 * return the appropriate export.
 * See /docs/Components.md
 *
 * @param  {object} module
 * @param  {string} name
 * @return {function|object}
 */
export default function getComponent(module, name) {
	// If the module defines a default export, return that
	// e.g.
	// ```
	// export default function Component() { ... }
	// ```
	if (module.default) {
		return module.default;
	}
	// If it is a CommonJS module which exports a function, return that
	// e.g.
	// ```
	// function Component() { ... }
	// module.exports = Component;
	// ```
	if (!module.__esModule && typeof module === 'function') {
		return module;
	}
	const moduleKeys = Object.keys(module);
	// If the module exports just one named export, return that
	// e.g.
	// ```
	// export function Component() { ... }
	// ```
	if (moduleKeys.length === 1) {
		return module[moduleKeys[0]];
	}
	// If the module exports a named export with the same name as the
	// understood Component identifier, return that
	// e.g.
	// ```
	// // /component.js
	// export function someUtil() { ... }
	// export Component() { ... } // if identifier is Component, return this named export
	// ```
	//
	// Else return the module itself
	return module[name] || module;
}
