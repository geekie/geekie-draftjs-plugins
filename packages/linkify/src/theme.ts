import { css } from 'linaria';

export interface LinkifyPluginTheme {
  styleButton?: string;
  styleInput?: string;
  styleLabel?: string;
  styleForm?: string;
  styleGlobal?: string;
}

export const defaultTheme: LinkifyPluginTheme = {
  styleButton: css`
    display: inline-block;
    width: 74px;
    height: 30px;
    margin: 10px;
    background-color: #ffffff;
    border: 1px solid #f1f1f1;
    &:hover {
      box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.25);
    }
  `,
  styleInput: css`
    display: block;
    margin-top: 6px;
    border: 1px solid #d3d7de;
    border-radius: 4px;
    width: 244px;
    height: 32px;
    margin-left: 16px;
  `,

  styleLabel: css`
    display: block;
    font-weight: 700;
    font-family: Lato, Arial;
    font-size: 14px;
    line-height: 17px;
    margin-top: 15px;
    margin-left: 16px;
    text-align: left;
  `,
  styleForm: css`
    pointer-events: all;
    border: 1px solid #f1f1f1;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.3);
    font-family: Lato, Arial;
    width: 280px;
    text-align: center;
    background-color: #ffffff;
    position: absolute;
    z-index: 99;
    top: 26px;
    left: 30%;
  `,
  styleGlobal: css`
    :global() {
      .Draftail-Editor {
        position: relative;
      }
    }
  `,
};
