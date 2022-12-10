import { InstanceFieldDecorationTypesUnion } from "source/Components/Constants";
import { OptionInitializerPlaceHolder } from "./Option.struct";
import { Dictionary } from "./Shared.struct";

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
