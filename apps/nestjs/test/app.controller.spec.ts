import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppController } from '../src/app.controller.js'
import { AppService } from '../src/app.service.js'

describe('AppController', () => {
  let controller: AppController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    controller = module.get<AppController>(AppController)
  })

  it('should return health status', () => {
    expect(controller.getHealth()).toEqual({ status: 'ok' })
  })
})
