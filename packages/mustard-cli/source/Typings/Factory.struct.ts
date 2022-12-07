export abstract class MustardLifeCycle {
  abstract onStart?(): void;
  abstract onError?(): void;
  abstract onComplete?(): void;
}
