import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  HttpException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { RequestAuthCodeDTO, VerifyAuthCodeDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-code')
  @HttpCode(HttpStatus.OK)
  async requestCode(
    @Body() requestAuthCode: RequestAuthCodeDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const { email } = requestAuthCode;

    try {
      await this.authService.requestAuthCode(email);
      return res.json({ message: 'Authentication code sent successfully.' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() verifyCodeBody: VerifyAuthCodeDTO,
    @Res()
    res: Response,
  ): Promise<Response> {
    // return res.json({
    //   token:
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1aWxoZXJtZS5jb3N0YUBjbG91ZHdhbGsuaW8iLCJ1c2VySWQiOjEsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzE4NTEwNTE0LCJleHAiOjE3MjExMDI1MTR9.8_2SlZm9MtwOpGwBpR9HNqDH-CPCD_GSjftBawSRjqE',
    //   message: 'Authentication successful.',
    // });
    const { email, code } = verifyCodeBody;

    try {
      const token = await this.authService.verifyAuthCode(email, code);
      if (token) {
        return res.json({
          token: token,
          message: 'Authentication successful.',
        });
      } else {
        throw new HttpException(
          'Invalid or expired code.',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
