// @ts-ignore
import { EditorPlugin } from '@draft-js-plugins/editor';
import { control, SelectImageControl } from './AddSymbolControl';

export { registerInsertSymbolCallback } from './register';

export interface SymbolPluginConfig {
  onInsertedSymbol: (symbol: string) => void;
}

export type SymbolEditorPlugin = EditorPlugin & {
  control: SelectImageControl;
};

export default (): SymbolEditorPlugin => ({
  control,
});
