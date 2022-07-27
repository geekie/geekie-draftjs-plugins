import React, { ReactElement, useState } from 'react';
import { DraftailEditor as Editor, INLINE_STYLE } from 'draftail';
import createImagePlugin, {
  registerUploadImageTask,
  imageEntityToHTML,
  htmlToImageEntity,
} from '@draft-js-plugins/image';
import 'draftail/dist/draftail.css';

import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

function convertToHTML(editorState: EditorState): string {
  return draftToHtml(
    convertToRaw(editorState.getCurrentContent()),
    undefined,
    undefined,
    (entity, text) => imageEntityToHTML(entity, text)
  );
}

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

const html = `<p>This is a paragraph!</p>
<p><strong>This is a bold paragraph!</strong></p>
<p></p>
<img src="https://picsum.photos/300/300" data-geekie-image data-width="580.1666660308838" data-height="580.1666660308838" style="height: 580.1666660308838px;width: 580.1666660308838px" />
<p></p>
<p><em>This is an italic paragraph!</em></p>
<p><strong>This</strong> <em>one</em> is kind of mixed 😅</p>
<p></p>
`;

// Register how to upload the selected image
registerUploadImageTask(() => Promise.resolve('https://picsum.photos/300/300'));

const SimpleImageEditor = (): ReactElement => {
  const contentState = ContentState.createFromBlockArray(
    htmlToDraft(html, (nodeName, node) => htmlToImageEntity(nodeName, node))
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );

  return (
    <div>
      <Editor
        readOnly
        topTool
        editorState={editorState}
        controls={[imagePlugin.control]}
        // eslint-disable-next-line no-shadow
        onChange={(editorState: EditorState) => {
          setEditorState(editorState);
          // eslint-disable-next-line no-console
          console.log('editorState as html: ', convertToHTML(editorState));
        }}
        inlineStyles={[
          { type: INLINE_STYLE.BOLD },
          { type: INLINE_STYLE.ITALIC },
        ]}
        entityTypes={[imagePlugin.entityType]}
        plugins={plugins}
      />
    </div>
  );
};

export default SimpleImageEditor;
