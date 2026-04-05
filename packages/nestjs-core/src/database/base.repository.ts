import { EntityRepository } from '@mikro-orm/postgresql'

export class BaseRepository<T extends object> extends EntityRepository<T> {
  /**
   * Persist and flush an entity in one call.
   */
  async persistAndFlush(entity: T): Promise<void> {
    this.getEntityManager().persist(entity)
    await this.getEntityManager().flush()
  }

  /**
   * Remove and flush an entity in one call.
   */
  async removeAndFlush(entity: T): Promise<void> {
    this.getEntityManager().remove(entity)
    await this.getEntityManager().flush()
  }
}
