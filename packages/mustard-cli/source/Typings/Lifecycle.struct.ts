export abstract class MustardLifecycle {
  abstract onStart?(): void;
  abstract onError?(error: unknown): void;
  abstract onComplete?(): void;
}
