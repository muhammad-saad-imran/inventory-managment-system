import { GenericRepo } from "@/utils/database/GenericRepo";

export abstract class GenericService<T> {
  repository: GenericRepo<T>;

  constructor(_repository: GenericRepo<T>) {
    this.repository = _repository;
  }

  async getAll(include?: string): Promise<T[]> {
    return this.repository.getAll(include);
  }

  async get(id: string, include?: string): Promise<T> {
    return this.repository.get(id, include);
  }

  async create(insertValue: T, include?: string): Promise<T> {
    return this.repository.create(insertValue, include);
  }

  async update(
    id: string,
    updateValue: Partial<T>,
    include?: string
  ): Promise<T> {
    return this.repository.update(id, updateValue, include);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
