import { TCustomStyling, TRichString } from "./styling";

export interface IComponentLogicFlow {
   uid: string;
   nodes: Record<string, ILogicNode>;
   connections: Record<string, ILogicOutgoingConnections | ILogicOutgoingConnectionIf>;
}

export interface ILogicNode {
   uid: string;
   name: string;
   type:
   | 'trigger.condition'
   | 'trigger.onClick' // prio #1
   | 'action.callAPI'
   | 'action.updateComponent' // prio #2
   | 'action.triggerComponentLogic'
   | 'action.setGlobalVar'
   | 'action.navigate'
   | 'action.dbCreate'
   | 'action.dbRead'
   | 'action.dbUpdate'
   | 'action.dbDelete'
   | 'action.dbUploadFile';
   // should we have a separate action for external links
   parameters: Record<string, TRichString>;
}

export interface ILogicCondition {
   expression: TRichString;
}

export interface ILogicCallAPI {
   url: TRichString;
   method: 'GET' | 'POST' | 'PUT' | 'DELETE';
   body?: TRichString;
   headers?: Record<string, TRichString>;
}

export interface ILogicUpdateComponent {
   componentId: string;
   properties: Record<string, TRichString>;
   styles: Record<string, TRichString>;
}

export interface ILogicTriggerComponentLogic {
   componentId: string;
   logicId: string;
}

export interface ILogicNavigate {
   type: 'navigateTo' | 'navigateBack';
   pageId?: string;
   params?: Record<string, TRichString>;
}

export interface ILogicOutgoingConnections {
   success: Record<string, ILogicConnection>;
   error?: Record<string, ILogicConnection>;
}
export interface ILogicOutgoingConnectionIf extends ILogicOutgoingConnections {
   failure?: Record<string, ILogicConnection>;
}

export interface ILogicConnection {
   uid: string;
   order: number;
   to: string;
}

export interface IInlineLogic {
   nodes: Record<string, IInlineLogicNode>;
   connections: Record<string, Record<string, ILogicConnection>>;
}

export interface IInlineLogicNode {
   uid: string;
   type:
   // inline entries
   | 'inline-entry.GetGlobalVar'
   | 'inline-entry.GetComponent'
   | 'inline-entry.Litteral' // string, number, boolean, etc
   | 'inline-entry.CurrentUser'
   | 'inline-entry.GetPageData'
   // inline logic
   | 'inline-node.GetComponentData'
   | 'inline-node.GetProperty'
   | 'inline-node.GetAttribute'
   | 'inline-node.Comparison'
   | 'inline-node.Combination'
   | 'inline-node.Contains'
   | 'inline-node.GetLastItem'
   | 'inline-entry.GetCurrentCellItem'
   | 'inline-node.IsEmpty';
   parameters: IInlineLogicGet | IInlineLogicComparison;
}

type TInlineLogicComparator = '=' | '!=' | '>' | '<' | '>=' | '<=';

export interface IInlineLogicComparison {
   comparator: TInlineLogicComparator;
}

export interface IInlineLogicGet {
   target: string;
}

export type TComponentVisualLogic = {
   condition: TRichString,
   styling?: TCustomStyling,
   properties?: Record<string, TRichString>,
}