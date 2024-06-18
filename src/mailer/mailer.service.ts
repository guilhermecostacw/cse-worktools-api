import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendEmailAuthCode(email: string, code: string): Promise<void> {
    const subject = 'Seu Código de Autenticação CSE WorkTools';
    const message = `Olá! Seu código de autenticação é: ${code}`;
    const mailOptions = {
      from: this.configService.get<string>('GMAIL_USER'),
      to: email,
      subject: subject,
      text: message,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email enviado com sucesso para:', email);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email');
    }
  }
}
