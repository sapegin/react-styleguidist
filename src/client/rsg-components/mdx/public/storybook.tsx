import Stub from './Stub';

// Storybook Doc Blocks drop-in emulation stubs
// Replace `@storybook/addon-docs/blocks` with `react-styleguidist/...`
//
// TODO: Most components aren't supported yet and render nothing

export { default as Story } from './Story';

export const Description = Stub;
export const Meta = Stub;
export const Preview = Stub;
export const Props = Stub;
export const Source = Stub;
