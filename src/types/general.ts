import { TComponent, TPage } from "./schema";

export type TCreateComponentFunc = (
   props: TPage | TComponent,
   parentDef?: TPage | TComponent
) => React.JSX.Element | null;

export type TCreateComponentFuncAsProp = {
   createComponentFunc: TCreateComponentFunc;
};
