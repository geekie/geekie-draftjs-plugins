import React, {
  ImgHTMLAttributes,
  ReactElement,
  useRef,
  useState,
} from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import { Rnd } from 'react-rnd';
import { useClickAway } from 'react-use';
import { defaultTheme, ImagePluginTheme } from './theme';

type ResizeData = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  block: ContentBlock;
  className?: string;
  theme: ImagePluginTheme;
  contentState: ContentState;

  blockStyleFn: unknown;
  blockProps: {
    resizeData?: ResizeData;
    setResizeData: (data: ResizeData) => void;
  };
  customStyleMap: unknown;
  customStyleFn: unknown;
  decorator: unknown;
  forceSelection: unknown;
  offsetKey: unknown;
  selection: unknown;
  tree: unknown;
  preventScroll: unknown;
}

export default React.forwardRef<HTMLImageElement, ImageProps>(
  // eslint-disable-next-line prefer-arrow-callback
  function Image(props, ref): ReactElement {
    const { block, ...otherProps } = props;
    // leveraging destructuring to omit certain properties from props
    const {
      blockProps: {
        setResizeData,
        resizeData = { width: 500, height: 500, x: 0, y: 0 },
      },
      customStyleMap, // eslint-disable-line @typescript-eslint/no-unused-vars
      customStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
      decorator, // eslint-disable-line @typescript-eslint/no-unused-vars
      forceSelection, // eslint-disable-line @typescript-eslint/no-unused-vars
      offsetKey, // eslint-disable-line @typescript-eslint/no-unused-vars
      selection, // eslint-disable-line @typescript-eslint/no-unused-vars
      tree, // eslint-disable-line @typescript-eslint/no-unused-vars
      blockStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
      preventScroll, // eslint-disable-line @typescript-eslint/no-unused-vars
      contentState,
      ...elementProps
    } = otherProps;

    const { src } = contentState.getEntity(block.getEntityAt(0)).getData();

    const { width, height, x, y } = resizeData;

    const [isFocus, setIsFocus] = useState(false);

    const containerRef = useRef(null);
    useClickAway(containerRef, (event) => {
      event.stopPropagation();
      setIsFocus(false);
    });

    return (
      <div
        style={{ height }}
        ref={containerRef}
        onClick={() => setIsFocus(true)}
      >
        <Rnd
          size={{ width, height }}
          dragAxis={'x'}
          maxWidth={864}
          maxHeight={864}
          position={{ x, y }}
          disableDragging={!isFocus}
          enableResizing={{
            topLeft: isFocus,
            topRight: isFocus,
            bottomLeft: isFocus,
            bottomRight: isFocus,
          }}
          lockAspectRatio
          onDragStop={(_e, d) => {
            setResizeData({ ...resizeData, x: d.x, y: 0 });
          }}
          resizeHandleClasses={{
            topRight: defaultTheme.resizeHandle,
            topLeft: defaultTheme.resizeHandle,
            bottomLeft: defaultTheme.resizeHandle,
            bottomRight: defaultTheme.resizeHandle,
          }}
          resizeHandleStyles={{
            topRight: { width: 8, height: 8, right: -8, top: -4 },
            topLeft: { width: 8, height: 8, left: -4, top: -4 },
            bottomRight: { width: 8, height: 8, bottom: -8, right: -8 },
            bottomLeft: { width: 8, height: 8, bottom: -8, left: -4 },
          }}
          onResize={(_e, _direction, refRect, _delta, newPosition) => {
            const newWidth = parseFloat(refRect.style.width);

            setResizeData({
              ...resizeData,
              width: newWidth,
              height: parseFloat(refRect.style.height),
              x: newPosition.x,
              y: 0,
            });
          }}
        >
          <img
            {...elementProps}
            ref={ref}
            src={src}
            style={isFocus ? { border: '2px solid #00A3FF' } : {}}
            role="presentation"
            draggable="false"
            className={defaultTheme.image}
          />
        </Rnd>
      </div>
    );
  }
);
