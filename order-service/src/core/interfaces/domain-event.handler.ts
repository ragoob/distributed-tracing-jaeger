export interface IDomainEventHandler<T> {
  handle(event: T): void;
}