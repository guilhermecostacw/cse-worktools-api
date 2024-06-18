import { Test, TestingModule } from '@nestjs/testing';
import { QueryParamsService } from './query_params.service';

describe('QueryParamsService', () => {
  let service: QueryParamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryParamsService],
    }).compile();

    service = module.get<QueryParamsService>(QueryParamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
