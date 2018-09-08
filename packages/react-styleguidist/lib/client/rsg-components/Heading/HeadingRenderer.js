import "core-js/modules/es6.object.assign";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.keys";

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Styled from 'rsg-components/Styled';

function _extends() { _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) {return {};} const target = _objectWithoutPropertiesLoose(source, excluded); let key; let i; if (Object.getOwnPropertySymbols) { const sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) {continue;} if (!Object.prototype.propertyIsEnumerable.call(source, key)) {continue;} target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) {return {};} const target = {}; const sourceKeys = Object.keys(source); let key; let i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) {continue;} target[key] = source[key]; } return target; }

const styles = function styles(_ref) {
  const color = _ref.color;

      
const fontFamily = _ref.fontFamily;

      
const fontSize = _ref.fontSize;
  return {
    heading: {
      margin: 0,
      color: color.base,
      fontFamily: fontFamily.base,
      fontWeight: 'normal'
    },
    heading1: {
      fontSize: fontSize.h1
    },
    heading2: {
      fontSize: fontSize.h2
    },
    heading3: {
      fontSize: fontSize.h3
    },
    heading4: {
      fontSize: fontSize.h4
    },
    heading5: {
      fontSize: fontSize.h5,
      fontWeight: 'bold'
    },
    heading6: {
      fontSize: fontSize.h6,
      fontStyle: 'italic'
    }
  };
};

function HeadingRenderer(_ref2) {
  const classes = _ref2.classes;

      
const level = _ref2.level;

      
const children = _ref2.children;

      
const props = _objectWithoutProperties(_ref2, ["classes", "level", "children"]);

  const Tag = "h".concat(level);
  const headingClasses = cx(classes.heading, classes["heading".concat(level)]);
  return React.createElement(Tag, _extends({}, props, {
    className: headingClasses
  }), children);
}

HeadingRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
  children: PropTypes.node
};
export default Styled(styles)(HeadingRenderer);