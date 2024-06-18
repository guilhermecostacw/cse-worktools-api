import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Definição do enum para simular o Link_type do Prisma
export enum LinkType {
  externo = 'externo',
  metabase = 'metabase',
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(LinkType)
  @IsNotEmpty()
  type: LinkType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  ownerId: string;
}
