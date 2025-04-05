import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatementDto } from './dto/create-statement.dto';
import { UpdateStatementDto } from './dto/update-statement.dto';
import { CardsService } from 'src/cards/cards.service';
import * as fs from 'fs';
import * as path from 'path';
import { BankExtractorFactory } from './bankExtractorFactory';
import { setGlobalForPdfLib } from './pdf-utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatementsService {
  constructor(
    private readonly cardService: CardsService,
    private readonly prisma: PrismaService,
  ) {}

  async processStatement(
    cardId: number,
    userId: number,
    file: Express.Multer.File,
  ) {
    const card = await this.cardService.findCardById(cardId, userId);
    if (!card) {
      throw new NotFoundException(`Card with ID ${cardId} not found`);
    }

    const uploadsDir = path.join(
      process.cwd(),
      'uploads',
      userId.toString(),
      cardId.toString(),
    );
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const fileName = `statement-${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);

    const pdfText = await this.extractTextFromPDF(file.buffer, card.lastFour);

    const bankExtractor = BankExtractorFactory.getExtractor(pdfText);
    const extractedData = bankExtractor.extractData(pdfText);

    return {
      success: true,
      message: 'PDF uploaded and parsed successfully',
      metadata: extractedData.metadata,
      transactions: extractedData.transactions || [],
    };
  }

  async processStatementUpload(
    cardId: number,
    file: Express.Multer.File,
    userId: number,
  ) {
    // Validate card ownership
    const card = await this.cardService.findCardById(cardId, userId);
    if (!card) {
      throw new NotFoundException(`Card with ID ${cardId} not found`);
    }

    // Save & Extract Data
    const statementData = await this.extractTextFromPDF(
      file.buffer,
      card.lastFour,
    );

    const bankExtractor = BankExtractorFactory.getExtractor(statementData);
    const extractedData = bankExtractor.extractData(statementData);
    console.log('extraction started');

    console.log(extractedData.transactions);

    // Save statement in DB
    // const statement = await this.prisma.statement.create({
    //   data: {
    //     cardId,
    //     userId,
    //     statementDate: statementData.statementDate,
    //     totalOutstanding: statementData.totalOutstanding,
    //     transactions: { createMany: { data: statementData.transactions } },
    //   },
    // });

    // return { success: true, statementId: statement.id, transactions: statementData.transactions };
  }

  private async extractTextFromPDF(
    pdfBuffer: Buffer,
    password: string,
  ): Promise<string> {
    const pdfjsLib = await import('pdfjs-dist');
    setGlobalForPdfLib();

    const loadingTask = pdfjsLib.getDocument({
      data: pdfBuffer,
      password: password,
    });

    const pdfDocument = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item) => item.str).join(' ') + '\n';
    }

    return fullText;
  }

  create(createStatementDto: CreateStatementDto) {
    return 'This action adds a new statement';
  }

  findAll() {
    return `This action returns all statements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statement`;
  }

  update(id: number, updateStatementDto: UpdateStatementDto) {
    return `This action updates a #${id} statement`;
  }

  remove(id: number) {
    return `This action removes a #${id} statement`;
  }
}
