import { NextRequest, NextResponse } from 'next/server';
import { S3UploadService } from '@/lib/services/s3-upload-service';
import { z } from 'zod';

// Validation schemas
const presignedUrlSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  contentType: z.string().min(1, 'Content type is required'),
  projectId: z.string().optional(),
  documentCategory: z.string().optional(),
});

const uploadConfirmationSchema = z.object({
  key: z.string().min(1, 'File key is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(1, 'File size is required'),
  contentType: z.string().min(1, 'Content type is required'),
  projectId: z.string().optional(),
  documentCategory: z.string().optional(),
});

/**
 * GET /api/files/upload
 * Generate presigned URL for file upload
 * Query parameters:
 * - fileName: string (required)
 * - contentType: string (required)
 * - projectId: string (optional)
 * - documentCategory: string (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const contentType = searchParams.get('contentType');
    const projectId = searchParams.get('projectId');
    const documentCategory = searchParams.get('documentCategory');

    // Validate required parameters
    const validationResult = presignedUrlSchema.safeParse({
      fileName,
      contentType,
      projectId: projectId || undefined,
      documentCategory: documentCategory || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { fileName: validFileName, contentType: validContentType, projectId: validProjectId, documentCategory: validDocumentCategory } = validationResult.data;

    // Generate presigned upload URL
    const presignedUrl = await S3UploadService.generatePresignedUploadUrl(
      validFileName,
      validContentType,
      validProjectId,
      validDocumentCategory
    );

    return NextResponse.json({
      data: presignedUrl,
      message: 'Presigned upload URL generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate presigned URL',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/files/upload
 * Direct file upload to S3 or confirm presigned upload
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');

    // Handle multipart form data (direct upload)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const projectId = formData.get('projectId') as string;
      const documentCategory = formData.get('documentCategory') as string;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file
      const validation = S3UploadService.validateFile(file);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      // Upload to S3
      const uploadResult = await S3UploadService.uploadFile(
        fileBuffer,
        file.name,
        file.type,
        projectId || undefined,
        documentCategory || undefined
      );

      return NextResponse.json({
        data: uploadResult,
        message: 'File uploaded successfully',
      });
    }

    // Handle JSON payload (upload confirmation)
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'confirm') {
      // Validate confirmation data
      const validationResult = uploadConfirmationSchema.safeParse(data);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Validation error',
            details: validationResult.error.format(),
          },
          { status: 400 }
        );
      }

      const confirmationData = validationResult.data;

      // Here you would typically save the file metadata to your database
      // For now, we'll return the confirmation
      const fileRecord = {
        ...confirmationData,
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-west-1'}.amazonaws.com/${confirmationData.key}`,
        uploadedAt: new Date(),
      };

      return NextResponse.json({
        data: fileRecord,
        message: 'Upload confirmed successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or request format' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      {
        error: 'Failed to process file upload',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/files/upload
 * Delete file from S3
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    await S3UploadService.deleteFile(key);

    return NextResponse.json({
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete file',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}