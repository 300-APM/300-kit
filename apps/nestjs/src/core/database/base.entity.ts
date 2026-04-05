import { BigIntType } from '@mikro-orm/core'
import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy'

export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuidv7()' })
  id!: string

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ version: true, type: new BigIntType('number'), defaultRaw: '1' })
  version!: number
}
