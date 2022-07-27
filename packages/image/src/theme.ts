import { css } from 'linaria';

export interface ImagePluginTheme {
  image?: string;
  imageContainer?: string;
  selectImageControlContainer?: string;
  selectImageControlPanel?: string;
  selectImageControlPanelTitle?: string;
  selectImageControlPanelTitleLabel?: string;
  selectImageControlPanelTitleBorder?: string;
  dropFileZone?: string;
  dropFileZoneContent?: string;
  dropFileZonePlaceholder?: string;
  dropFileZoneImage?: string;
  selectImageButtonGroup?: string;
  selectImageButton?: string;
  selectImageButtonDisabled?: string;
  errorMessage?: string;
  resizeHandle?: string;
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
  selectImageControlContainer: css`
    position: relative;
  `,
  selectImageControlPanel: css`
    box-sizing: border-box;
    position: absolute;
    background: #ffffff;
    border: 1px solid #f1f1f1;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.3);
    width: 267px;
    padding: 26px 16px 16px 16px;
    z-index: 100;
    left: 0px;
    top: 30px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
  `,
  selectImageControlPanelTitle: css`
    display: flex;
    align-self: flex-start;
    flex-direction: column;
    align-items: center;
    margin-left: 5px;
  `,
  selectImageControlPanelTitleLabel: css`
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
    color: #111112;
  `,
  selectImageControlPanelTitleBorder: css`
    box-sizing: border-box;
    margin-top: 6px;
    width: 82px;
    height: 2px;
    background: #2d64b1;
  `,
  dropFileZone: css`
    box-sizing: border-box;
    width: 235px;
    margin-top: 20px;
    background: #f1f1f1;
    padding: 10px;
  `,
  dropFileZoneContent: css`
    width: 215px;
    box-sizing: border-box;
    border: 2px dashed #808080;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 5px;
    cursor: pointer;
  `,
  dropFileZonePlaceholder: css`
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
    color: #838383;
  `,
  dropFileZoneImage: css`
    object-fit: contain;
    width: 200px;
    max-height: 200px;
  `,
  selectImageButtonGroup: css`
    box-sizing: border-box;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  `,
  selectImageButton: css`
    width: 75px;
    height: 30px;
    border: 1px solid #f1f1f1;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 5px;
    cursor: pointer;

    &:hover {
      box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.25);
    }
  `,
  selectImageButtonDisabled: css`
    background: #ebe9e9;
    color: #a9a8a8;
    cursor: not-allowed;
  `,
  errorMessage: css`
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 14px;
    color: #d93734;
    margin-top: 10px;
  `,
  resizeHandle: css`
    width: 8px;
    height: 8px;
    background: #00a3ff;
    position: absolute;
  `,
};
