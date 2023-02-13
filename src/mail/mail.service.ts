import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `Email sent to ${to} with subject "${subject}" and text "${text}"`,
        );
        resolve();
      }, 500);
    });
  }
}
