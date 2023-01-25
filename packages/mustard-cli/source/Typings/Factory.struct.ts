export abstract class MustardApp {
  abstract onStart?(): void;
  abstract onError?(error: unknown): void;
  abstract onComplete?(): void;
}
