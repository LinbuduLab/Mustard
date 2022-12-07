import { InstanceFieldDecorationTypesUnion } from "source/Components/Constants";
import { OptionInitializerPlaceHolder } from "./Option.struct";
import { Dictionary } from "./Shared.struct";

export type TaggedDecoratedInstanceFields = {
  key: string;
  type: InstanceFieldDecorationTypesUnion;
  value: Dictionary;
};
