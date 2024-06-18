import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  isNumber,
} from 'class-validator';

export enum ParamType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
}

export class QueryParamDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsOptional()
  defaultValue: string;

  @IsEnum(ParamType)
  type: ParamType;
}
