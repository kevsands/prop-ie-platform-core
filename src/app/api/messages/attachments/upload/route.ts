// File upload API for message attachments
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream' // For CAD files like .dwg
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const conversationId = formData.get('conversationId') as string;
    const messageId = formData.get('messageId') as string;

    if (!conversationId || !messageId) {
      return NextResponse.json(
        { error: 'Conversation ID and Message ID are required' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'messages', conversationId);

    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      const filePath = join(uploadDir, uniqueFilename);

      // Convert file to buffer and write to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      // Create file metadata
      const fileData = {
        id: uuidv4(),
        originalName: file.name,
        filename: uniqueFilename,
        size: file.size,
        type: file.type,
        url: `/uploads/messages/${conversationId}/${uniqueFilename}`,
        uploadedAt: new Date().toISOString(),
        conversationId,
        messageId
      };

      uploadedFiles.push(fileData);
    }

    // In production, save file metadata to database
    // await prisma.messageAttachment.createMany({
    //   data: uploadedFiles.map(file => ({
    //     id: file.id,
    //     messageId: messageId,
    //     fileName: file.originalName,
    //     fileType: file.type,
    //     fileSize: file.size,
    //     url: file.url,
    //     uploadedAt: new Date(file.uploadedAt)
    //   }))
    // });

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

// Get file metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const conversationId = searchParams.get('conversationId');

    if (!messageId && !conversationId) {
      return NextResponse.json(
        { error: 'Message ID or Conversation ID required' },
        { status: 400 }
      );
    }

    // In production, fetch from database
    // const attachments = await prisma.messageAttachment.findMany({
    //   where: messageId ? { messageId } : { message: { conversationId } }
    // });

    // For now, return mock data
    const mockAttachments = [
      {
        id: 'att_001',
        messageId: messageId || 'msg_001',
        fileName: 'Floor_Plans_Unit_12A.pdf',
        fileType: 'application/pdf',
        fileSize: 2048576,
        url: '/uploads/messages/sample/floor_plans.pdf',
        uploadedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      attachments: mockAttachments
    });

  } catch (error: any) {
    console.error('Get attachments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attachments' },
      { status: 500 }
    );
  }
}