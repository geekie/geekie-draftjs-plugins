import { css } from 'linaria';

export interface KatexPluginTheme {
  styleGlobal?: string;
}

export const defaultTheme: KatexPluginTheme = {
  styleGlobal: css`
    :global() {
      .mq-editable-field {
        border-width: 1px !important;
      }
    }
  `,
};
