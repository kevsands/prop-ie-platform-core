// services/contract/ContractService.ts
import { Request, Response, NextFunction } from 'express';
import { BaseService } from '../base/BaseService';
import { ContractData, ContractOptions, RequestHandler, SelectionData, TextStyle } from '../../types/express';
import { PDFDocument } from 'pdf-lib'; // Assuming you're using pdf-lib
import * as fs from 'fs';
import * as path from 'path';
import { sanitizePath } from '../../utils/path-sanitizer';

export class ContractService extends BaseService {
  constructor(port: number) {
    super('contract-service', port);
  }

  protected setupRoutes(): void {
    // Create contract route
    this.router.post('/contracts', this.createContract);

    // Get contract route
    this.router.get('/contracts/:id', this.getContractById);

    // Update contract route
    this.router.put('/contracts/:id', this.updateContract);

    // Delete contract route
    this.router.delete('/contracts/:id', this.deleteContract);

    // Generate PDF route
    this.router.post('/contracts/:id/generate-pdf', this.generateContractPdf);

    // Sign contract route
    this.router.post('/contracts/:id/sign', this.signContract);
  }

  /**
   * Create a new contract
   */
  private createContract: RequestHandler = async (req, resnext) => {
    try {
      const contractData: ContractData = req.body;

      // Validate contract data
      if (!contractData.title) {
        return res.status(400).json({ error: 'Contract title is required' });
      }

      if (!contractData.content) {
        return res.status(400).json({ error: 'Contract content is required' });
      }

      // Insert to database
      if (!this.db) {
        throw new Error('Database connection not established');
      }

      const result = await this.db.collection('contracts').insertOne({
        ...contractData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft'
      });

      // Publish event
      this.publishEvent('contract.created', {
        contractId: result.insertedId.toString(),
        title: contractData.title
      });

      res.status(201).json({
        id: result.insertedId,
        ...contractData,
        createdAt: new Date(),
        status: 'draft'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get contract by ID
   */
  private getContractById: RequestHandler = async (req, resnext) => {
    try {
      const contractId = req.params.id;

      if (!contractId) {
        return res.status(400).json({ error: 'Contract ID is required' });
      }

      if (!this.db) {
        throw new Error('Database connection not established');
      }

      const contract = await this.db.collection('contracts').findOne({
        _id: contractId
      });

      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      res.json(contract);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update an existing contract
   */
  private updateContract: RequestHandler = async (req, resnext) => {
    try {
      const contractId = req.params.id;
      const updateData: Partial<ContractData> = req.body;

      if (!contractId) {
        return res.status(400).json({ error: 'Contract ID is required' });
      }

      if (!this.db) {
        throw new Error('Database connection not established');
      }

      // Don't allow updating the ID or creation date
      delete updateData.id;
      delete updateData.createdAt;

      updateData.updatedAt = new Date();

      const result = await this.db.collection('contracts').updateOne(
        { _id: contractId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Publish event
      this.publishEvent('contract.updated', {
        contractId,
        updateData
      });

      res.json({
        success: true,
        updatedFields: Object.keys(updateData)
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a contract
   */
  private deleteContract: RequestHandler = async (req, resnext) => {
    try {
      const contractId = req.params.id;

      if (!contractId) {
        return res.status(400).json({ error: 'Contract ID is required' });
      }

      if (!this.db) {
        throw new Error('Database connection not established');
      }

      const result = await this.db.collection('contracts').deleteOne({
        _id: contractId
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Publish event
      this.publishEvent('contract.deleted', {
        contractId
      });

      res.json({
        success: true,
        message: 'Contract deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Generate PDF for a contract
   */
  private generateContractPdf: RequestHandler = async (req, res, next) => {
    try {
      const contractId = req.params.id;

      if (!contractId) {
        return res.status(400).json({ error: 'Contract ID is required' });
      }

      // Validate contractId format
      if (!/^[a-zA-Z0-9-_]+$/.test(contractId)) {
        return res.status(400).json({ error: 'Invalid contract ID format' });
      }

      if (!this.db) {
        throw new Error('Database connection not established');
      }

      // Retrieve contract data
      const contract = await this.db.collection('contracts').findOne({
        _id: contractId
      });

      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Generate PDF
      const pdfBuffer = await this.generatePdf(contract);

      // Sanitize and validate storage path
      const baseStoragePath = process.env.PDF_STORAGE_PATH || 'pdfs';
      const sanitizedBasePath = sanitizePath(baseStoragePath);
      
      if (!sanitizedBasePath) {
        throw new Error('Invalid storage path configuration');
      }

      const pdfPath = path.join(sanitizedBasePath, `${contractId}.pdf`);

      // Ensure the path is within the allowed directory
      const resolvedPath = path.resolve(pdfPath);
      if (!resolvedPath.startsWith(path.resolve(sanitizedBasePath))) {
        throw new Error('Invalid file path');
      }

      // Create directory if it doesn't exist
      if (!fs.existsSync(path.dirname(pdfPath))) {
        fs.mkdirSync(path.dirname(pdfPath), { recursive: true, mode: 0o755 });
      }

      // Write file with proper permissions
      if (Buffer.isBuffer(pdfBuffer)) {
        fs.writeFileSync(pdfPath, new Uint8Array(pdfBuffer), { mode: 0o644 });
      } else if (typeof pdfBuffer === 'object' && pdfBuffer !== null && 'buffer' in pdfBuffer) {
        fs.writeFileSync(pdfPath, new Uint8Array(Buffer.from(pdfBuffer as any)), { mode: 0o644 });
      } else if (typeof pdfBuffer === 'string') {
        fs.writeFileSync(pdfPath, pdfBuffer, { mode: 0o644 });
      } else {
        fs.writeFileSync(pdfPath, String(pdfBuffer), { mode: 0o644 });
      }

      // Update contract with PDF path
      await this.db.collection('contracts').updateOne(
        { _id: contractId },
        { 
          $set: { 
            pdfPath,
            updatedAt: new Date()
          } 
        }
      );

      res.json({
        success: true,
        pdfPath
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sign a contract
   */
  private signContract: RequestHandler = async (req, resnext) => {
    try {
      const contractId = req.params.id;
      const { signatory, signature } = req.body;

      if (!contractId) {
        return res.status(400).json({ error: 'Contract ID is required' });
      }

      if (!signatory) {
        return res.status(400).json({ error: 'Signatory information is required' });
      }

      if (!signature) {
        return res.status(400).json({ error: 'Signature is required' });
      }

      if (!this.db) {
        throw new Error('Database connection not established');
      }

      // Retrieve contract
      const contract = await this.db.collection('contracts').findOne({
        _id: contractId
      });

      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Update contract with signature
      const signatures = contract.signatures || [];
      signatures.push({
        signatory,
        signature,
        timestamp: new Date()
      });

      await this.db.collection('contracts').updateOne(
        { _id: contractId },
        { 
          $set: { 
            signatures,
            status: this.isFullySigned(contractsignatures) ? 'signed' : 'pending',
            updatedAt: new Date()
          } 
        }
      );

      // Publish event
      this.publishEvent('contract.signed', {
        contractId,
        signatory,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: 'Contract signed successfully',
        status: this.isFullySigned(contractsignatures) ? 'signed' : 'pending'
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error signing contract: ${err.message}`);
      next(error);
    }
  };

  /**
   * Check if all signatories have signed
   */
  private isFullySigned(contract: any, signatures: any[]): boolean {
    const requiredSignatories = contract.signatories || [];
    const signedBy = signatures.map(s => s.signatory);

    return requiredSignatories.every((signatory: string) => 
      signedBy.includes(signatory)
    );
  }

  /**
   * Generate PDF from contract data
   */
  private async generatePdf(contractData: ContractData): Promise<Buffer | Uint8Array | string> {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

      // Helper function to add text to the PDF
      const addText = (text: string, x: number, yPos: number, style: TextStyle = {}) => {
        // This is just a placeholder since we don't have the actual implementation
        // In a real implementation, you would use the PDF library's text functions
        const fontSize = style.fontSize || 12;
        const isBold = style.bold || false;

        // PDF-LIB doesn't have direct methods to handle these properties
        // so you'd implement the actual drawing logic

        // Example:
        // page.drawText(text, {
        //   x,
        //   y: yPos,
        //   size: fontSize,
        //   font: isBold ? boldFont : regularFont
        // });

        // For line gap handling
        const lineGap = style.lineGap || 0;
        return yPos - (fontSize + lineGap);
      };

      // Draw contract content
      let yPosition = 800;

      // Draw title
      yPosition = addText(contractData.title, 50, yPosition, { 
        fontSize: 18, 
        bold: true,
        align: 'center'
      });

      yPosition -= 20; // Add space after title

      // Draw content
      const paragraphs = contractData.content.split('\n\n');
      for (const paragraph of paragraphs) {
        yPosition = addText(paragraph, 50, yPosition, {
          fontSize: 12,
          lineGap: 6
        });
        yPosition -= 10; // Space between paragraphs
      }

      // Add signature fields if needed
      yPosition -= 40;

      for (const signatory of contractData.signatories) {
        yPosition = addText(`Signature: ${signatory}`, 50, yPosition, {
          fontSize: 12,
          bold: true
        });

        // Draw signature line
        // page.drawLine({
        //   start: { x: 150, y: yPosition - 10 },
        //   end: { x: 350, y: yPosition - 10 },
        //   thickness: 1
        // });

        yPosition -= 50;
      }

      // Handle contract options
      if (contractData.options) {
        const options = contractData.options as ContractOptions;

        // Handle expiry date if present
        if (options.expiresAt) {
          yPosition = addText(`Valid until: ${options.expiresAt.toLocaleDateString()}`, 
            50, yPosition, { fontSize: 10 });
        }

        // Handle any form selections
        if (options.selections && Array.isArray(options.selections)) {
          yPosition -= 20;
          yPosition = addText("Selections:", 50, yPosition, { 
            fontSize: 12, 
            bold: true 
          });

          for (const selection of options.selections as SelectionData[]) {
            yPosition -= 15;
            const selectionText = `${selection.option}: ${Object.entries(selection)
              .filter(([key]) => key !== 'option')
              .map(([keyvalue]) => `${key}=${value}`)
              .join(', ')}`;

            yPosition = addText(selectionText, 70, yPosition, { fontSize: 10 });
          }
        }
      }

      // Save document to buffer
      const pdfBytes = await pdfDoc.save();

      // pdf-lib returns a Uint8Array, which we convert to Buffer
      // This is type-compatible with our return type
      return Buffer.from(pdfBytes.buffer);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`PDF generation error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Extract signatories from contract text
   */
  private extractSignatories(text: string): string[] {
    const signatoryRegex = /\bParty\s+([A-Z])\s*:\s*([^,\n]+)/g;
    // Using manual regex exec loop instead of matchAll to avoid downlevelIteration requirement
    const matches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    while ((match = signatoryRegex.exec(text)) !== null) {
      matches.push(match);
    }
    return matches.map(match => match[2].trim());
  }
}