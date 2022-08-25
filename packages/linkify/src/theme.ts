import { css } from 'linaria';

export interface LinkifyPluginTheme {
  styleButton?: string;
  styleInput?: string;
  styleLabel?: string;
  styleForm?: string;
  styleGlobal?: string;
  styleLinkSpan?: string;
  styleLinkDivTooltip?: string;
  styleLinkTooltip?: string;
  styleLinkTooltipIcon?: string;
  styleLinkTooltipText?: string;
  styleLinkUrl?: string;
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
  styleLinkSpan: css`
    display: inline-block;
    color: #0f6dff;
    text-decoration: underline;
    position: relative;
    &:hover {
      cursor: pointer;
    }
  `,
  styleGlobal: css`
    :global() {
      .Draftail-Editor {
        position: relative;
      }
      .Draftail-Editor .DraftEditor-root {
        overflow: visible;
      }
    }
  `,
  styleLinkDivTooltip: css`
    box-sizing: border-box;
    position: absolute;
    background: #ffffff;
    border: 1px solid #f1f1f1;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    top: 25px;
    text-align: center;
    z-index: 99;
    white-space: nowrap;
  `,
  styleLinkTooltip: css`
    text-decoration: none;
    font-family: Lato, Arial;
    font-style: normal;
    font-weight: bold;
    line-height: 40px;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    padding-left: 8px;
    padding-right: 8px;
    vertical-align: top;
    &:hover {
      cursor: pointer;
    }
  `,
  styleLinkUrl: css`
    font-size: 14px;
    color: #0f6dff;
    &:hover {
      text-decoration: underline;
    }
  `,
  styleLinkTooltipIcon: css`
    margin-left: 18px;
    margin-right: 12px;
  `,
  styleLinkTooltipText: css`
    font-size: 13px;
    padding-right: 12px;
    padding-left: 12px;
    color: #111112;
    &:hover {
      color: #0b43bf;
    }
  `,
};
