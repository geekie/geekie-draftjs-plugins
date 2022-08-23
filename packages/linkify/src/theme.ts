import { css } from 'linaria';

export interface LinkifyPluginTheme {
  styleButton?: string;
  styleInput?: string;
  styleLabel?: string;
  styleForm?: string;
}

export const defaultTheme: LinkifyPluginTheme = {
  styleButton: css`
    display: inline-block;
    width: 74px;
    height: 30px;
    margin: 10px;
    background-color: #FFFFFF;
    border: 1px solid #F1F1F1;
    &:hover {
      box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.25);
    }
  `,
  styleInput: css`
    display: block;
    margin-top: 6px;
    border: 1px solid #D3D7DE;
    borderRadius: 4px;
    width: 244px;
    height: 32px;
    margin-left: 16px;
  `,
  
  styleLabel: css`
    display: block;
    font-weight: 700;
    font-family: Lato, Arial;
    font-size: 14;
    line-height: 17px;
    margin-top: 15px;
    margin-left: 16px;
    text-align: left;
  `,
  styleForm: css`
    pointer-events: all;
    border: 1px solid #F1F1F1;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.3);
    font-family: Lato, Arial;
    width: 280px;
    text-align: center;
    background-color: #FFFFFF;
    position: absolute;
    z-index: 99;
  `,
};
