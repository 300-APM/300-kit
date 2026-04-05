import { BigIntType } from '@mikro-orm/core'
import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy'
import { uuidv7 } from 'uuidv7'

export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv7()

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ version: true, type: new BigIntType('number') })
  version: number = 1
}
