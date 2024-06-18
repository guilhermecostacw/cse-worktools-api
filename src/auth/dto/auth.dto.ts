import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestAuthCodeDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyAuthCodeDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
