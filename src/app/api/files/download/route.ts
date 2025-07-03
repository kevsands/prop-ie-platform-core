import { NextRequest, NextResponse } from 'next/server';
import { S3UploadService } from '@/lib/services/s3-upload-service';

/**
 * GET /api/files/download
 * Generate presigned URL for file download
 * Query parameters:
 * - key: string (required)
 * - expiresIn: number (optional, default 3600 seconds)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600');

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Generate presigned download URL
    const downloadUrl = await S3UploadService.generatePresignedDownloadUrl(key, expiresIn);

    return NextResponse.json({
      data: {
        downloadUrl,
        key,
        expiresIn,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      },
      message: 'Download URL generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate download URL',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}