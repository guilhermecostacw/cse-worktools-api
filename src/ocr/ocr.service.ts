import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import { Express } from 'express'; // Importando Express corretamente

@Injectable()
export class OcrService {
  async extractText(file: Express.Multer.File): Promise<string> {
    const { data: { text } } = await Tesseract.recognize(file.buffer, 'eng', {
      logger: (m) => console.log(m),
    });
    return text;
  }
}
