import type { z } from "zod";
import type { InstanceFieldDecorationTypes } from "../Utils/Constants";

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
