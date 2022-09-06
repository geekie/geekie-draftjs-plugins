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
import { MAX_CONSTRAINT_PX, MIN_CONSTRAINT_PX } from './constants';
import { defaultTheme, ImagePluginTheme } from './theme';

type ResizeData = {
  width: number;
  height: number;
};

type SizeConstraints = {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
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
    onChangeFocus: (isFocus: boolean) => void;
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
        onChangeFocus,
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
    const [constraints, setConstraints] = useState<SizeConstraints | null>(
      null
    );

    if (!constraints) {
      const ratio = width / height;
      if (ratio === 1) {
        setConstraints({
          minWidth: MIN_CONSTRAINT_PX,
          minHeight: MIN_CONSTRAINT_PX,
          maxWidth: MAX_CONSTRAINT_PX,
          maxHeight: MAX_CONSTRAINT_PX,
        });
      } else if (ratio > 1) {
        setConstraints({
          minWidth: MIN_CONSTRAINT_PX * ratio,
          minHeight: MIN_CONSTRAINT_PX,
          maxWidth: MAX_CONSTRAINT_PX,
          maxHeight: MAX_CONSTRAINT_PX / ratio,
        });
      } else {
        setConstraints({
          minWidth: MIN_CONSTRAINT_PX,
          minHeight: MIN_CONSTRAINT_PX / ratio,
          maxWidth: MAX_CONSTRAINT_PX * ratio,
          maxHeight: MAX_CONSTRAINT_PX,
        });
      }
    }

    useEffect(() => onChangeFocus(isFocus), [isFocus]);

    const containerRef = useRef(null);
    useClickAway(containerRef, (event) => {
      event.stopPropagation();
      setIsFocus(false);
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
          minConstraints={[
            constraints?.minWidth || MIN_CONSTRAINT_PX,
            constraints?.minHeight || MIN_CONSTRAINT_PX,
          ]}
          maxConstraints={[
            constraints?.maxWidth || MAX_CONSTRAINT_PX,
            constraints?.maxHeight || MAX_CONSTRAINT_PX,
          ]}
          resizeHandles={isFocus ? ['sw', 'nw', 'se', 'ne'] : []}
          handle={renderHandle}
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
