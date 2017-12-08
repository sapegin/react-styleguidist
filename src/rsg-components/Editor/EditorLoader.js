/* eslint-disable no-undef */

import React, { Component } from 'react';
import EditorLoaderRenderer from 'rsg-components/Editor/EditorLoaderRenderer';

export default class EditorLoader extends Component {
	state = {
		editor: null,
	};

	componentDidMount() {
		System.import('rsg-components/Editor/Editor').then(module => {
			this.setState({ editor: module.default });
		});
	}

	render() {
		const Editor = this.state.editor;
		if (Editor) {
			return <Editor {...this.props} />;
		}

		return <EditorLoaderRenderer />;
	}
}
