import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs/promises';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'qr');

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Generate a QR code PNG for a batch and return the public URL.
 * QR encodes the public verification URL.
 */
export async function generateBatchQR(batchCode: string): Promise<string> {
  const verifyUrl = `${env.FRONTEND_URL}/verify/${batchCode}`;
  const filename = `qr-${batchCode}.png`;
  const filePath = path.join(UPLOADS_DIR, filename);

  await ensureDir(UPLOADS_DIR);

  await QRCode.toFile(filePath, verifyUrl, {
    width: 400,
    margin: 2,
    color: { dark: '#1a3a2a', light: '#ffffff' },
  });

  const publicUrl = `${env.STORAGE_URL}/qr/${filename}`;
  logger.info({ batchCode, publicUrl }, 'QR code generated');
  return publicUrl;
}

/**
 * Generate a QR code as a data URL (base64) for inline embedding.
 */
export async function generateBatchQRDataUrl(batchCode: string): Promise<string> {
  const verifyUrl = `${env.FRONTEND_URL}/verify/${batchCode}`;
  return QRCode.toDataURL(verifyUrl, {
    width: 400,
    margin: 2,
    color: { dark: '#1a3a2a', light: '#ffffff' },
  });
}
