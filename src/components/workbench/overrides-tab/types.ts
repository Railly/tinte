export interface OverrideVariable {
  key: string;
  name: string;
  description: string;
}

export interface OverrideVariableGroup {
  label: string;
  description: string;
  variables: OverrideVariable[];
}
