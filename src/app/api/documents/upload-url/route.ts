import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyCSRFToken } from "@/components/security/CSRFToken";
import sanitize from "@/lib/security/sanitize";
import { z } from "zod";

// Validation schema
const uploadUrlSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  userId: z.string().optional(),
  documentType: z.string().optional(),
  folder: z.string().optional().default("documents")
});

// AWS S3 Configuration
const s3Config = {
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
};

const s3Client = new S3Client(s3Config);
const bucketName = process.env.AWS_S3_BUCKET_NAME || "propie-documents-production";

/**
 * POST /api/documents/upload-url
 * Generate a presigned URL for secure file upload to AWS S3
 * 
 * Request body:
 * - fileName: Name of the file to upload
 * - fileType: MIME type of the file
 * - userId: Optional user ID for access control
 * - documentType: Optional document type for organization
 * - folder: Optional folder path (defaults to "documents")
 * 
 * Response:
 * - uploadUrl: Presigned URL for PUT request
 * - fileUrl: Final URL where file will be accessible
 * - expiresIn: URL expiration time in seconds
 * - key: S3 object key
 */
export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token for security
    const csrfToken = request.headers.get('x-csrf-token');
    if (!csrfToken || !verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token" },
        { status: 403 }
      );
    }

    // Check AWS configuration
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
      console.error("Missing AWS configuration. Required: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME");
      return NextResponse.json(
        { error: "AWS S3 configuration is missing" },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedBody = typeof rawBody === 'object' && rawBody !== null 
      ? sanitize.sanitizeObject(rawBody) 
      : {};

    // Validate using Zod schema
    const validationResult = uploadUrlSchema.safeParse(sanitizedBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const { fileName, fileType, userId, documentType, folder } = validationResult.data;

    // Validate file type against allowed types
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (!allowedMimeTypes.includes(fileType)) {
      return NextResponse.json(
        { error: `File type ${fileType} is not allowed` },
        { status: 400 }
      );
    }

    // Sanitize filename to prevent path traversal and special characters
    const sanitizedFileName = sanitize.stripHtml(fileName)
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');

    if (!sanitizedFileName) {
      return NextResponse.json(
        { error: "Invalid file name" },
        { status: 400 }
      );
    }

    // Generate unique key for S3 object
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = sanitizedFileName.split('.').pop() || '';
    const baseName = sanitizedFileName.replace(/\.[^/.]+$/, "");
    
    // Organize files by folder structure
    let s3Key: string;
    if (userId) {
      // User-specific folder structure
      const userFolder = documentType ? `${folder}/${documentType}` : folder;
      s3Key = `${userFolder}/${userId}/${timestamp}-${randomId}-${baseName}.${fileExtension}`;
    } else {
      // General folder structure
      const typeFolder = documentType ? `${folder}/${documentType}` : folder;
      s3Key = `${typeFolder}/${timestamp}-${randomId}-${baseName}.${fileExtension}`;
    }

    // Configure S3 put object command
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      ContentType: fileType,
      ServerSideEncryption: "AES256",
      Metadata: {
        'original-filename': fileName,
        'upload-timestamp': timestamp.toString(),
        'user-id': userId || 'anonymous',
        'document-type': documentType || 'general'
      },
      // Add content disposition for proper file downloads
      ContentDisposition: `inline; filename="${sanitizedFileName}"`
    });

    // Generate presigned URL (expires in 15 minutes)
    const expiresIn = 15 * 60; // 15 minutes in seconds
    const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn
    });

    // Generate the final file URL (for referencing after upload)
    const fileUrl = `https://${bucketName}.s3.${s3Config.region}.amazonaws.com/${s3Key}`;

    return NextResponse.json({
      uploadUrl,
      fileUrl,
      key: s3Key,
      expiresIn,
      bucket: bucketName,
      region: s3Config.region,
      message: "Presigned URL generated successfully"
    });

  } catch (error: any) {
    console.error("Error generating presigned URL:", error);
    
    // Handle specific AWS S3 errors
    if (error.name === 'CredentialsError') {
      return NextResponse.json(
        { error: "AWS credentials are invalid or missing" },
        { status: 500 }
      );
    }
    
    if (error.name === 'NetworkError') {
      return NextResponse.json(
        { error: "Unable to connect to AWS S3" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to generate upload URL",
        message: error.message || "Internal server error"
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-csrf-token',
      'Access-Control-Max-Age': '86400',
    },
  });
}