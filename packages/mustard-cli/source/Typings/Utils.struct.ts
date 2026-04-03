import type { z } from "zod";
import {
  InstanceFieldAdditionalDecorationTypes,
  InstanceFieldDecorationTypes,
} from "../Utils/Constants.js";

export interface BaseClassFieldInitialValue {
  type: InstanceFieldDecorationTypes;
  description?: string;
  initValue?: unknown;
  schema?: z.Schema;
}

export interface OptionInitialValue extends BaseClassFieldInitialValue {
  type: InstanceFieldDecorationTypes.Option;

  optionName?: string;
  optionAlias?: string;
}

// export class DecoratorInitialValue<T extends BaseClassFieldInitialValue> {
//   public constructor(public value: T) {
//     if (
//       value.type &&
//       (value.type in InstanceFieldDecorationTypes ||
//         value.type in InstanceFieldAdditionalDecorationTypes)
//     ) {
//       this.value = {
//         ...this.value,
//         ...value,
//       };
//     }
//   }
// }

export interface BasePlaceholder {
  type: InstanceFieldDecorationTypes;
  optionName?: string;
  optionAlias?: string;
  description?: string;
  initValue?: unknown;
  schema?: z.Schema;
}

export type TaggedDecoratedInstanceFields = {
  key: string;
  type: InstanceFieldDecorationTypes;
  value: BasePlaceholder;
};
