export type Tconstraint = TdefaultConstraint | Tcombination

export type TdefaultConstraint = {
   key: string,
   comparator: '=' | '!=' | '>' | '>=' | '<' | '<='
   value: string | number | boolean
}

export type Tcombination = {
   comparator: 'AND' | 'OR'
   value: Tconstraint[]
}

export interface DataBaseContext {
    dbCreate: (assetType: string, data: Record<string, any>) => Promise<void>;
    dbRead: (assetType: string, constraints: Tconstraint, view: Record<string, string>) => Promise<any>;
    dbUpdate: (assetType: string, assetId: string, updatedData: any) => Promise<void>;
    dbDelete: (assetType: string, assetId: string) => Promise<void>;
  }