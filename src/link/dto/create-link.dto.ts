import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateQueryParamDto } from 'src/query_params/dto/create-query-params.dto';
import { QueryParamDto } from 'src/query_params/dto/query-params.dto';

export class CreateLinkDto {
  @IsString()
  name: string;

  @IsString()
  endpoint: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsBoolean()
  @IsOptional()
  isGeneral: boolean = false;

  @ValidateNested({ each: true })
  @Type(() => QueryParamDto)
  queryParams: QueryParamDto[];
}
