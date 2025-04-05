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
    const pdfText = await this.extractTextFromPDF(file.buffer, card.lastFour);

    const bankExtractor = BankExtractorFactory.getExtractor(pdfText);
    const extractedData = bankExtractor.extractData(pdfText);

    // Format statement date
    const statementDate = extractedData.metadata.statementDate;
    if (!statementDate) {
      throw new Error('Statement date not found in the document');
    }

    // Convert statement date to DateTime
    const formattedStatementDate = new Date(
      `${statementDate.year}-${statementDate.month}-${statementDate.date}`,
    );

    // Check for duplicate statement
    const existingStatement = await this.prisma.statement.findFirst({
      where: {
        cardId,
        statementDate: formattedStatementDate,
      },
    });

    if (existingStatement) {
      return {
        success: false,
        message: 'Statement for this date already exists',
        error: 'DUPLICATE_STATEMENT',
      };
    }

    // Format transactions for database
    const formattedTransactions = extractedData.transactions.map(
      (transaction) => ({
        cardId,
        amount: transaction.settlementAmount,
        currency: transaction.settlementCurrency,
        description: transaction.description,
        transactionDate: new Date(transaction.date),
        status: 'completed',
      }),
    );

    // Save statement and transactions in DB
    const statement = await this.prisma.statement.create({
      data: {
        cardId,
        statementDate: formattedStatementDate,
        totalOutstanding: extractedData.metadata.totalOutstanding,
        fileUrl: file.originalname,
      },
    });

    //create transactions with statementId
    const transactions = await this.prisma.transaction.createMany({
      data: formattedTransactions.map((transaction) => ({
        ...transaction,
        statementId: statement.id,
      })),
    });

    return {
      success: true,
      message: 'Statement uploaded successfully',
      statementId: statement.id,
      transactions: transactions.count,
    };
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

  async findAll(userId: number) {
    const statements = await this.prisma.statement.findMany({
      where: {
        card: {
          userId: userId,
        },
      },
      include: {
        card: {
          select: {
            lastFour: true,
            bank: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        transactions: {
          orderBy: {
            transactionDate: 'desc',
          },
        },
      },
      orderBy: {
        statementDate: 'desc',
      },
    });

    return statements;
  }

  async findOne(id: number, userId: number) {
    const statement = await this.prisma.statement.findFirst({
      where: {
        id,
        card: {
          userId: userId,
        },
      },
      include: {
        card: {
          select: {
            lastFour: true,
            bank: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        transactions: {
          orderBy: {
            transactionDate: 'desc',
          },
        },
      },
    });

    if (!statement) {
      throw new NotFoundException(`Statement with ID ${id} not found`);
    }

    return statement;
  }

  update(id: number, updateStatementDto: UpdateStatementDto) {
    return `This action updates a #${id} statement`;
  }

  remove(id: number) {
    return `This action removes a #${id} statement`;
  }
}
