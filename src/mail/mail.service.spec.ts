import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email', async () => {
    const spy = jest.spyOn(console, 'log');

    await service.sendEmail(
      'lucascdornelas@gmail.com',
      'Despesa Cadastrada',
      `Despesa Cadastrada`,
    );

    expect(spy).toHaveBeenCalledWith(
      'Email sent to lucascdornelas@gmail.com with subject "Despesa Cadastrada" and text "Despesa Cadastrada"',
    );

    spy.mockRestore();
  });
});
