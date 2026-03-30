import { CommandRegistry } from "../CommandRegistry.js";
import { MustardInternalUtils } from "../../Utils/Utils.js";

import type { InjectInitializerPlaceHolder } from "../../Typings/Context.struct.js";
import type { MustardCommand } from "../../Typings/Command.struct.js";
import { ProviderRegistry } from "../ProviderRegistry.js";

export class InjectNormalizer {
  public static normalize(instance: MustardCommand, instanceField: string) {
    const injectValue = <InjectInitializerPlaceHolder>(
      MustardInternalUtils.getInstanceFieldValue(instance, instanceField)
    );

    const providerFactory = ProviderRegistry.ExternalProviderRegistry.get(
      injectValue.identifier,
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
            resolvedValue,
          );
        })
      : MustardInternalUtils.setInstanceFieldValue(
          instance,
          instanceField,
          provideValue,
        );
  }
}
