import { BankExtractor } from './bankExtractor';
import { EblExtractor } from './extractors/eblExtractor';
import { MTBExtractor } from './extractors/mtbExtractor';

type ExtractorConstructor = new () => BankExtractor;

export class BankExtractorFactory {
  private static extractorMap: { [key: string]: ExtractorConstructor } = {
    EBL: EblExtractor,
    MTB: MTBExtractor,
  };

  static getExtractor(text: string): BankExtractor {
    for (const [keyword, ExtractorClass] of Object.entries(this.extractorMap)) {
      if (new RegExp(`\\b${keyword}\\b`, 'i').test(text)) {
        return new ExtractorClass();
      }
    }
    throw new Error('Unsupported bank format');
  }
}
