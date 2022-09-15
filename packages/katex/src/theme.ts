import { css } from 'linaria';

export interface KatexPluginTheme {
  styleGlobal?: string;
}

export const defaultTheme: KatexPluginTheme = {
  styleGlobal: css`
    :global() {
      .mq-editable-field {
        border: 1px solid #0b43bf !important;
      }
    }
  `,
};
