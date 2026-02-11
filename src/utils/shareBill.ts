import LZString from 'lz-string';
import type { Bill } from '../types';

/**
 * Encode bill data to a compressed, URL-safe string
 * @param bill - The bill object to encode
 * @returns URL-safe encoded string
 */
export function encodeBillToUrl(bill: Bill): string {
  try {
    // Convert bill to JSON string
    const jsonStr = JSON.stringify(bill);

    // Compress using LZString
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);

    return compressed;
  } catch (error) {
    console.error('Error encoding bill:', error);
    throw new Error('Failed to encode bill data');
  }
}

/**
 * Decode bill data from a compressed, URL-safe string
 * @param encoded - The encoded string from URL
 * @returns The decoded Bill object
 */
export function decodeBillFromUrl(encoded: string): Bill | null {
  try {
    // Decompress using LZString
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);

    if (!decompressed) {
      return null;
    }

    // Parse JSON
    const bill = JSON.parse(decompressed) as Bill;

    // Basic validation
    if (!bill.id || !bill.name || !bill.people || !bill.expenses) {
      return null;
    }

    return bill;
  } catch (error) {
    console.error('Error decoding bill:', error);
    return null;
  }
}

/**
 * Generate a shareable URL for a bill
 * @param bill - The bill object to share
 * @returns Complete URL with encoded bill data
 */
export function generateShareUrl(bill: Bill): string {
  const encoded = encodeBillToUrl(bill);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?data=${encodeURIComponent(encoded)}`;
}

/**
 * Parse the current URL to extract shared bill data
 * @returns Bill object if URL contains valid shared data, null otherwise
 */
export function parseSharedBillFromUrl(): Bill | null {
  const params = new URLSearchParams(window.location.search);
  const data = params.get('data');

  if (!data) {
    return null;
  }

  return decodeBillFromUrl(data);
}
