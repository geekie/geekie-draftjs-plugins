import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { DraftailEditor } from 'draftail';
import createLinkifyPlugin, {
  linkEntityToHTML
} from '../../../packages/linkify/src';
import 'draftail/dist/draftail.css';

import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

function convertToHTML(editorState: EditorState): string {
  return draftToHtml(
    convertToRaw(editorState.getCurrentContent()),
    undefined,
    undefined
  );
}

export default {
  title: 'Links/Linkify plugin',
  component: DraftailEditor,
} as Meta;

const linkifyPlugin = createLinkifyPlugin();

const html = `
<p></p>
<p>oi fulano <a href="http://one.geekie.com.br" target="_blank">testestesteste</a> blablabla</p>
<p></p>
<p><a href="http://one.geekie.com.br" target="_blank">teste2</a></p>
<p></p>
`;


export const Default: Story = () => {
  const contentState = ContentState.createFromBlockArray(
    htmlToDraft(html)
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );

  const handleEditorChange = (e: EditorState): void => {
    setEditorState(e);
    console.log(convertToHTML(e));
  };

  return (
    <DraftailEditor
      editorState={editorState}
      entityTypes={[linkifyPlugin.entityType]}
      plugins={[linkifyPlugin]}
      onChange={handleEditorChange}
    />
  );
};
