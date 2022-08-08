import { css } from 'linaria';

export interface ImagePluginTheme {
  image?: string;
  imageContainer?: string;
  closeIcon?: string;
  addSymbolControlContainer?: string;
  addSymbolControlPanel?: string;
  addSymbolControlPanelTitle?: string;
  addSymbolControlPanelTitleLabel?: string;
  addSymbolControlPanelTitleBorder?: string;
  addSymbolDropdown?: string;
  symbolGrids?: string;
  symbolGrid?: string;
  closeButton?: string;
}

export const defaultTheme: ImagePluginTheme = {
  image: css`
    pointer-events: none;
    width: 100%;
    height: 100%;
  `,
  imageContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  // control styles
  addSymbolControlContainer: css`
    position: relative;
  `,
  addSymbolControlPanel: css`
    box-sizing: border-box;
    position: absolute;
    background: #ffffff;
    border: 1px solid #f1f1f1;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.3);
    width: 283px;
    padding: 26px 16px 16px 16px;
    z-index: 100;
    left: 0px;
    top: 30px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
  `,
  addSymbolControlPanelTitle: css`
    display: flex;
    align-self: flex-start;
    flex-direction: column;
    align-items: center;
    margin-left: 5px;
  `,
  addSymbolControlPanelTitleLabel: css`
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
    color: #111112;
  `,
  addSymbolControlPanelTitleBorder: css`
    box-sizing: border-box;
    margin-top: 6px;
    width: 82px;
    height: 2px;
    background: #2d64b1;
    align-self: flex-start;
    margin-left: 15px;
  `,
  addSymbolDropdown: css`
    width: 173px;
    margin-top: 18px;
  `,
  symbolGrids: css`
    overflow: hidden;
    overflow-y: scroll;
    border: 1px solid rgb(204, 204, 204);
    margin-top: 15px;
    width: 242px;
    height: 172px;
    position: relative;
  `,
  symbolGrid: css`
    user-select: none;
    width: 24px;
    height: 24px;
    border-bottom: 1px solid rgb(204, 204, 204);
    border-right: 1px solid rgb(204, 204, 204);
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 24px;
    text-align: center;
    display: inline-block;
    align-items: center;
    cursor: pointer;
    color: #000000;
  `,
  closeButton: css`
    margin-left: auto;
    margin-right: auto;
    margin-top: 23px;
    width: 75px;
    height: 30px;
    border: 1px solid #f1f1f1;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.25);
    }
  `,
  closeIcon: css`
    position: absolute;
    top: 16px;
    right: 13px;
    cursor: pointer;
  `,
};
