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

export class CreateQueryParamDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  defaultValue: string;

  @IsEnum(ParamType)
  type: ParamType;

  @IsNotEmpty()
  @IsInt()
  linkId: number;
}
