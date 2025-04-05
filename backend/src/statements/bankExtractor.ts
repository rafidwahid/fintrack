export interface BankExtractor {
  extractData(text: string): {
    metadata: any;
    transactions: any[];
  };
}
