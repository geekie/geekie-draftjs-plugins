import { css } from 'linaria';

export interface ImagePluginTheme {
  selectImageControlContainer?: string;
  selectImageControlPanel?: string;
}

export const defaultTheme: ImagePluginTheme = {
  // control styles
  selectImageControlContainer: css`
    position: relative;
  `,
  selectImageControlPanel: css`
    position: absolute;
    background: #ffffff;
    border: 1px solid #f1f1f1;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
  `,
};
