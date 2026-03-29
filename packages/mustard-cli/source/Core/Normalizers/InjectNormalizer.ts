import { MustardRegistry } from "../Registry";
import { MustardInternalUtils } from "../../Utils/Utils";

import type { InjectInitializerPlaceHolder } from "../../Typings/Context.struct";
import type { MustardCommand } from "../../Typings/Command.struct";

export class InjectNormalizer {
  public static normalize(instance: MustardCommand, instanceField: string) {
    const injectValue = <InjectInitializerPlaceHolder>(
      MustardInternalUtils.getInstanceFieldValue(instance, instanceField)
    );

    const providerFactory = MustardRegistry.ExternalProviderRegistry.get(
      injectValue.identifier
    );

    const provideValue =
      typeof providerFactory === "function"
        ? MustardInternalUtils.isConstructable(providerFactory)
          ? new providerFactory()
          : providerFactory()
        : providerFactory;

    MustardInternalUtils.isPromise(provideValue)
      ? provideValue.then((resolvedValue) => {
          MustardInternalUtils.setInstanceFieldValue(
            instance,
            instanceField,
            resolvedValue
          );
        })
      : MustardInternalUtils.setInstanceFieldValue(
          instance,
          instanceField,
          provideValue
        );
  }
}
