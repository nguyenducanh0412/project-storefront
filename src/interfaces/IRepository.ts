export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getDetail(id: number): Promise<T>;
  create(item: T): Promise<T>;
  update(id: number, item: T): Promise<T>;
  delete(id: number): Promise<T>;
}
