import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'

export class DatabaseSeeder extends Seeder {
  async run(_em: EntityManager): Promise<void> {
    // Add seed logic here
  }
}
