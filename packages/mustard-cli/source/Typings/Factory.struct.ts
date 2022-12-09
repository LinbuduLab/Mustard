export abstract class MustardApp {
  abstract onStart?(): void;
  abstract onError?(): void;
  abstract onComplete?(): void;
}
