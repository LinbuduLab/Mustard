import type { InstanceFieldDecorationTypesUnion } from "source/Components/Constants";

export interface BasePlaceholder {
  type: InstanceFieldDecorationTypesUnion;
  optionName?: string;
  optionAlias?: string;
  description?: string;
  initValue?: unknown;
}

export type TaggedDecoratedInstanceFields = {
  key: string;
  type: InstanceFieldDecorationTypesUnion;
  value: BasePlaceholder;
};
