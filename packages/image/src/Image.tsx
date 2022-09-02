import { ContentBlock, ContentState } from 'draft-js';
import React, {
  CSSProperties,
  ImgHTMLAttributes,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Resizable, ResizableProps } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useClickAway } from 'react-use';
import { defaultTheme, ImagePluginTheme } from './theme';

type ResizeData = {
  width: number;
  height: number;
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
    onStartEdit: () => void;
    onFinishEdit: () => void;
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
        resizeData = { width: 500, height: 500 },
        onStartEdit,
        onFinishEdit,
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

    const { width, height } = resizeData;

    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
      if (isFocus) onStartEdit();
    }, [isFocus]);

    const containerRef = useRef(null);
    useClickAway(containerRef, (event) => {
      event.stopPropagation();
      if (!isFocus) return;
      setIsFocus(false);
      onFinishEdit();
    });

    // eslint-disable-next-line no-shadow
    const renderHandle: ResizableProps['handle'] = (resizeHandle, ref) => {
      let style: CSSProperties = {};
      if (resizeHandle === 'sw') {
        style = {
          width: 8,
          height: 8,
          bottom: -8,
          left: -4,
          cursor: 'sw-resize',
        };
      } else if (resizeHandle === 'ne') {
        style = {
          width: 8,
          height: 8,
          right: -8,
          top: -4,
          cursor: 'ne-resize',
        };
      } else if (resizeHandle === 'se') {
        style = {
          width: 8,
          height: 8,
          right: -8,
          bottom: -8,
          cursor: 'se-resize',
        };
      } else if (resizeHandle === 'nw') {
        style = { width: 8, height: 8, left: -4, top: -4, cursor: 'nw-resize' };
      }

      return (
        <div
          style={style}
          className={`GeekieImage-ResizeHandle ${defaultTheme.resizeHandle}`}
          ref={ref}
        />
      );
    };

    return (
      <div
        className={`GeekieImage-ImageContainer ${defaultTheme.imageContainer}`}
        style={{ height }}
        ref={containerRef}
        onClick={() => setIsFocus(true)}
      >
        <Resizable
          height={height}
          width={width}
          maxConstraints={[864, 864]}
          resizeHandles={isFocus ? ['sw', 'nw', 'se', 'ne'] : []}
          handle={renderHandle}
          handleSize={[10, 10]}
          lockAspectRatio
          onResize={(_event, { size }) => {
            setResizeData({
              width: size.width,
              height: size.height,
            });
          }}
        >
          <div
            style={{
              width,
              height,
            }}
          >
            <img
              {...elementProps}
              ref={ref}
              src={src}
              style={
                isFocus
                  ? { border: '2px solid #00A3FF' }
                  : { border: '2px solid rgba(0, 0, 0, 0)' }
              }
              role="presentation"
              draggable="false"
              className={`GeekieImage-Image ${defaultTheme.image}`}
            />
          </div>
        </Resizable>
      </div>
    );
  }
);
