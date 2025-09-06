/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../errorHelpers/AppError";
import PDFDocument from "pdfkit";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  username: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const buffer: Uint8Array[] = [];
      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      //   pdf content
      doc.fontSize(20).text("Invoice,", { align: "center" });
      doc.moveDown();

      doc.fontSize(14).text(`TransactionId: ${invoiceData.transactionId}`);
      doc.text(`Booking Date: ${invoiceData.bookingDate}`);
      doc.text(`Customer : ${invoiceData.username}`);
      doc.moveDown();

      doc.text(`Tour ${invoiceData.tourTitle}`);
      doc.text(`Guests : ${invoiceData.guestCount}`);
      doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)}`);
      doc.moveDown();

      doc.text(`Thank you for booking with us!`, { align: "center" });
    });
  } catch (error: any) {
    console.log(`Invoice Error, ${error}`);
    throw new AppError(400, `Invoice Error, ${error.message}`);
  }
};
