import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../database/base.entity.js'

@Entity()
export class Tenant extends BaseEntity {
  @Property()
  name!: string

  @Property({ unique: true })
  slug!: string

  @Property({ default: true })
  active: boolean = true
}
