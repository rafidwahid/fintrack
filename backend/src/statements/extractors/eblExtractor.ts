import { BankExtractor } from '../bankExtractor';

export class EblExtractor implements BankExtractor {
  extractData(text: string) {
    return {
      metadata: {
        totalOutstanding: this.extractTotalOutstanding(text),
        closingBalance: this.extractClosingBalance(text),
      },
      transactions: this.extractTransactions(text),
    };
  }

  private extractTotalOutstanding(text: string): number | undefined {
    const match = text.match(/Total\s+Outstanding\s*:?\s*([0-9,]+\.[0-9]{2})/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : undefined;
  }

  private extractClosingBalance(text: string): number | undefined {
    const match = text.match(/Closing\s+Balance\s*:?\s*([0-9,]+\.[0-9]{2})/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : undefined;
  }

  // private extractTransactions(text: string) {
  //   const transactions = [];
  //   const transactionPattern =
  //     /(\d{2}-[A-Za-z]{3}-\d{4})\s+(.+?)\s+(BDT)\s+([\d,]+\.\d{2})\s+(BDT)\s+([\d,]+\.\d{2})/g;
  //   let match;
  //   while ((match = transactionPattern.exec(text)) !== null) {
  //     transactions.push({
  //       date: match[1],
  //       description: match[2].trim(),
  //       sourceCurrency: match[3],
  //       sourceAmount: parseFloat(match[4].replace(/,/g, '')),
  //       settlementCurrency: match[5],
  //       settlementAmount: parseFloat(match[6].replace(/,/g, '')),
  //     });
  //   }
  //   return transactions;
  // }

  private extractTransactions(text: string) {
    const transactions = [];

    // Step 1: Find the "Transactional Details" heading and ensure we're inside that section
    const transactionSectionPattern = /Transactional\s+Details.*?Card\s+#/s;
    const transactionSectionMatch = transactionSectionPattern.exec(text);

    if (transactionSectionMatch) {
      // Step 2: Get the part of the text starting after "Card #"
      const sectionAfterCard = text.slice(transactionSectionMatch.index);

      // Step 3: Define the transaction pattern
      const transactionPattern =
        /(\d{2}-[A-Za-z]{3}-\d{4})\s+(.+?)\s+(BDT)\s+([\d,]+\.\d{2})\s+(BDT)\s+([\d,]+\.\d{2})/g;

      let match;
      while ((match = transactionPattern.exec(sectionAfterCard)) !== null) {
        transactions.push({
          date: match[1],
          description: match[2].trim(),
          sourceCurrency: match[3],
          sourceAmount: parseFloat(match[4].replace(/,/g, '')),
          settlementCurrency: match[5],
          settlementAmount: parseFloat(match[6].replace(/,/g, '')),
        });
      }
    }

    return transactions;
  }
}
