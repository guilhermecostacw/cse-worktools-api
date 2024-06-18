import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async requestAuthCode(email: string): Promise<void> {
    if (!email.endsWith('@cloudwalk.io')) {
      throw new Error('Only CloudWalk emails are allowed.');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 10 * 60000); // Code expires in 10 minutes

    await this.prisma.authCode.create({
      data: {
        userEmail: email,
        code: code,
        expiresAt: expiresAt,
      },
    });

    await this.mailerService.sendEmailAuthCode(email, code);
  }

  async verifyAuthCode(email: string, code: string): Promise<string | null> {
    const authCode = await this.prisma.authCode.findFirst({
      where: {
        userEmail: email,
        code: code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!authCode) {
      return null;
    }

    await this.prisma.authCode.delete({
      where: { id: authCode.id },
    });
    
    return await this.handleUserLogin(email);
  }

  private async handleUserLogin(email: string): Promise<string> {
    let user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: email,
          role: 'User',
        },
      });
    }

    const payload = { email: user.email, userId: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
