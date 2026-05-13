import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { formatDate, BANANA_VARIETIES } from '../utils/format';
import { getPreferences } from './preferenceService';

// PDF-safe currency formatter (jsPDF's built-in fonts don't support ₹)
function formatPDFCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rs. 0.00';
  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const parts = absNum.toFixed(2).split('.');
  let intPart = parts[0];
  const decPart = parts[1];
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);
    const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    intPart = formatted + ',' + last3;
  }
  const result = `Rs. ${intPart}.${decPart}`;
  return isNegative ? `-${result}` : result;
}

export function generateBillPDF(bill, traderInfo = null) {
  // Use provided traderInfo or fallback to defaults
  const trader = traderInfo || {
    traderName: 'ALPHOVINS GLOBAL AGRO EXPORTS',
    traderPhone: '8012111116',
    traderAddress: '12/141-12 Anandanadarkudi Road Pampanvilai Nagercoil Kanyakumari Tamilnadu-629201',
    traderEmail: 'admin@salero.com'
  };

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ---- HEADER ----
  doc.setFillColor(20, 83, 45);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(String(trader.traderName).toUpperCase(), pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(String(trader.traderAddress), pageWidth / 2, 26, { align: 'center' });
  doc.text(`Phone: ${trader.traderPhone} | Email: ${trader.traderEmail}`, pageWidth / 2, 31, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SALE BILL', pageWidth / 2, 40, { align: 'center' });

  y = 55;

  // ---- BILL INFO BOX ----
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'S');
  
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(10);
  
  // Left column — consistent label/value positions
  const leftLabelX = margin + 5;
  const leftValueX = margin + 30;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Bill ID:', leftLabelX, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(String(bill.billId || 'N/A'), leftValueX, y + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', leftLabelX, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(String(formatDate(bill.saleDate)), leftValueX, y + 16);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Merchant:', leftLabelX, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(String(bill.merchantName || 'N/A'), leftValueX, y + 24);
  
  // Right column — consistent label/value positions
  const rightLabelX = pageWidth / 2 + 10;
  const rightValueX = rightLabelX + 25;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Variety:', rightLabelX, y + 8);
  doc.setFont('helvetica', 'normal');
  const variety = BANANA_VARIETIES.find(v => v.value === bill.bananaVariety);
  doc.text(String(variety ? variety.label : (bill.customVariety || bill.bananaVariety || 'N/A')), rightValueX, y + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Status:', rightLabelX, y + 16);
  doc.setFont('helvetica', 'normal');
  const statusText = bill.paymentStatus === 'paid' ? 'PAID' : 
                     bill.paymentStatus === 'partial' ? 'PARTIAL' : 'PENDING';
  const statusColor = bill.paymentStatus === 'paid' ? [34, 197, 94] : 
                      bill.paymentStatus === 'partial' ? [234, 179, 8] : [239, 68, 68];
  doc.setTextColor(...statusColor);
  doc.text(statusText, rightValueX, y + 16);

  y += 40;

  // ---- WEIGHT TABLE ----
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Weight Details', margin, y);
  y += 5;

  const weightRows = (bill.weightEntries || []).map((entry, i) => [
    i + 1,
    entry.quantity || 0,
    `${Number(entry.weight || 0).toFixed(2)} kg`,
  ]);

  weightRows.push([
    { content: 'TOTAL', colSpan: 1, styles: { fontStyle: 'bold', fillColor: [220, 252, 231] } },
    { content: bill.totalQuantity || 0, styles: { fontStyle: 'bold', fillColor: [220, 252, 231] } },
    { content: `${Number(bill.grossWeight || 0).toFixed(2)} kg`, styles: { fontStyle: 'bold', fillColor: [220, 252, 231] } },
  ]);

  autoTable(doc, {
    startY: y,
    head: [['S.No', 'Quantity (Thars)', 'Weight (kg)']],
    body: weightRows,
    theme: 'grid',
    headStyles: {
      fillColor: [22, 101, 52],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [20, 83, 45],
    },
    alternateRowStyles: {
      fillColor: [240, 253, 244],
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 60, halign: 'center' },
      2: { halign: 'right' },
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // ---- CALCULATION SUMMARY ----
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 83, 45);
  doc.text('Bill Summary', margin, y);
  y += 5;

  const summaryData = [
    ['Gross Weight', `${Number(bill.grossWeight || 0).toFixed(2)} kg`],
    ['Wastage', `${Number(bill.wastage || 0).toFixed(2)} kg`],
    ['Net Weight', `${Number(bill.netWeight || 0).toFixed(2)} kg`],
    ['Rate per kg', formatPDFCurrency(bill.ratePerKg || 0)],
    ['Total Amount', formatPDFCurrency(bill.totalAmount || 0)],
  ];

  if (bill.paymentStatus === 'partial') {
    summaryData.push(
      ['Amount Paid', formatPDFCurrency(bill.amountPaid || 0)],
      ['Balance Due', formatPDFCurrency((bill.totalAmount || 0) - (bill.amountPaid || 0))]
    );
  }

  autoTable(doc, {
    startY: y,
    body: summaryData,
    theme: 'plain',
    bodyStyles: {
      fontSize: 10,
      textColor: [20, 83, 45],
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
    didParseCell: function(data) {
      if (data.row.index === summaryData.length - 1 || 
          (data.row.cells[0] && data.row.cells[0].raw && String(data.row.cells[0].raw).includes('Total Amount'))) {
        data.cell.styles.fontSize = 12;
        data.cell.styles.fillColor = [220, 252, 231];
      }
    }
  });

  y = doc.lastAutoTable.finalY + 15;

  // ---- CUSTOM GREETING FLAG ----
  if (trader.whatsappGreeting && trader.whatsappGreeting.trim()) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(20, 83, 45);
    
    // Auto-wrap greeting text if it's long
    const greetingLines = doc.splitTextToSize(`"${trader.whatsappGreeting}"`, contentWidth - 10);
    doc.text(greetingLines, pageWidth / 2, y + 5, { align: 'center' });
    y += (greetingLines.length * 5) + 5;
  }

  // ---- FOOTER ----
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  
  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.text('This is a computer-generated bill.', pageWidth / 2, y, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, y + 5, { align: 'center' });

  return doc;
}

// Build a clean filename: BILL-2026-001_Kumar_Traders.pdf
export function buildFilename(bill) {
  const billId = bill.billId || 'bill';
  const merchant = (bill.merchantName || 'unknown')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return `${billId}_${merchant}.pdf`;
}

export async function downloadBillPDF(bill) {
  try {
    const prefs = await getPreferences();
    const doc = generateBillPDF(bill, prefs);
    const filename = buildFilename(bill);
    const blob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    // Open PDF in a new tab — 100% reliable, user can view/print/save
    const pdfWindow = window.open(blobUrl, '_blank');
    
    if (pdfWindow) {
      // Set the tab title to the filename
      pdfWindow.addEventListener('load', () => {
        try { pdfWindow.document.title = filename; } catch(e) {}
      });
    } else {
      // Popup blocked — fallback to file-saver download
      saveAs(blob, filename);
    }

    // Also try a direct download as backup
    setTimeout(() => {
      try {
        saveAs(blob, filename);
      } catch(e) {
        // Ignore — user already has the PDF open in a tab
      }
    }, 500);

    // Cleanup blob URL after a delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } catch (err) {
    console.error('PDF generation error:', err);
    alert('Failed to generate PDF. Please try again.');
  }
}

export async function getBillPDFBlob(bill) {
  const prefs = await getPreferences();
  const doc = generateBillPDF(bill, prefs);
  return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
}

// ─── ONLINE ORDER INVOICE ───────────────────────────────────────────────────

export function generateOnlineOrderInvoicePDF(order) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const company = {
    name: 'ALPHOVINS GLOBAL AGRO EXPORTS',
    address: '12/141-12 Anandanadarkudi Road Pampanvilai',
    address2: 'Nagercoil, Kanyakumari, Tamil Nadu - 629201',
    phone: '+91 89250 11054',
    email: 'business.alphovins@gmail.com',
    gst: 'GSTIN: AS PER RECORDS',
  };

  const orderDate = order.createdAt
    ? new Date(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt)
    : new Date();

  const invoiceNo = `INV-${orderDate.getFullYear()}-${order.id?.slice(-6)?.toUpperCase() || 'XXXXXX'}`;

  // ── HEADER BAND ──
  doc.setFillColor(20, 83, 45);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name, pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(company.address, pageWidth / 2, 23, { align: 'center' });
  doc.text(company.address2, pageWidth / 2, 28, { align: 'center' });
  doc.text(`Ph: ${company.phone}  |  ${company.email}`, pageWidth / 2, 33, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', pageWidth / 2, 44, { align: 'center' });

  y = 58;

  // ── INVOICE META + CUSTOMER INFO (two-column) ──
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'S');

  // Left — Invoice details
  const lx = margin + 4;
  doc.setFontSize(9);
  doc.setTextColor(20, 83, 45);

  doc.setFont('helvetica', 'bold');  doc.text('Invoice No.:', lx, y + 8);
  doc.setFont('helvetica', 'normal'); doc.text(invoiceNo, lx + 26, y + 8);

  doc.setFont('helvetica', 'bold');  doc.text('Order ID:', lx, y + 15);
  doc.setFont('helvetica', 'normal'); doc.text(`#${order.id?.slice(-8)?.toUpperCase() || 'N/A'}`, lx + 26, y + 15);

  doc.setFont('helvetica', 'bold');  doc.text('Date:', lx, y + 22);
  doc.setFont('helvetica', 'normal'); doc.text(orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), lx + 26, y + 22);

  doc.setFont('helvetica', 'bold');  doc.text('Time:', lx, y + 29);
  doc.setFont('helvetica', 'normal'); doc.text(orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }), lx + 26, y + 29);

  // Right — Customer details
  const rx = pageWidth / 2 + 5;
  const customer = order.customerDetails || {};

  doc.setFont('helvetica', 'bold');  doc.text('Bill To:', rx, y + 8);
  doc.setFont('helvetica', 'normal'); doc.text(customer.name || 'N/A', rx + 18, y + 8);

  doc.setFont('helvetica', 'bold');  doc.text('Phone:', rx, y + 15);
  doc.setFont('helvetica', 'normal'); doc.text(customer.phone || 'N/A', rx + 18, y + 15);

  doc.setFont('helvetica', 'bold');  doc.text('Email:', rx, y + 22);
  doc.setFont('helvetica', 'normal');
  const emailText = customer.email || 'N/A';
  doc.text(emailText.length > 28 ? emailText.substring(0, 25) + '...' : emailText, rx + 18, y + 22);

  doc.setFont('helvetica', 'bold');  doc.text('Address:', rx, y + 29);
  doc.setFont('helvetica', 'normal');
  const addr = `${customer.address || ''}, ${customer.city || ''} - ${customer.pincode || ''}`;
  const addrLines = doc.splitTextToSize(addr, contentWidth / 2 - 20);
  doc.text(addrLines[0], rx + 18, y + 29);

  y += 44;

  // ── ITEMS TABLE ──
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 83, 45);
  doc.text('Order Items', margin, y);
  y += 4;

  const itemRows = (order.cartItems || []).map((item, i) => {
    const unitPrice = item.purchaseType === 'kg' ? (item.pricePerKg || 0) : (item.pricePerThar || 0);
    const subtotal = unitPrice * (item.quantity || 0);
    return [
      i + 1,
      item.name || 'N/A',
      item.purchaseType === 'kg' ? 'Per Kg' : 'Per Thar',
      item.quantity || 0,
      formatPDFCurrency(unitPrice),
      formatPDFCurrency(subtotal),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['#', 'Product Name', 'Unit Type', 'Qty', 'Unit Price', 'Subtotal']],
    body: itemRows,
    theme: 'grid',
    headStyles: {
      fillColor: [22, 101, 52],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: { fontSize: 9, textColor: [20, 83, 45] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 55 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 32, halign: 'right' },
      5: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 6;

  // ── TOTALS BLOCK ──
  const totalAmount = order.totalAmount || 0;
  const totalsData = [
    ['Subtotal', formatPDFCurrency(totalAmount)],
    ['Shipping Charges', 'FREE'],
    ['Total Amount Paid', formatPDFCurrency(totalAmount)],
  ];

  autoTable(doc, {
    startY: y,
    body: totalsData,
    theme: 'plain',
    bodyStyles: { fontSize: 10, textColor: [20, 83, 45], cellPadding: 2.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 130 },
      1: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
    didParseCell(data) {
      if (data.row.index === 2) {
        data.cell.styles.fillColor = [220, 252, 231];
        data.cell.styles.fontSize = 12;
      }
    },
  });

  y = doc.lastAutoTable.finalY + 8;

  // ── PAYMENT INFO ──
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 83, 45);
  doc.text('Payment Information', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Method: Razorpay (Online)`, margin + 4, y + 13);
  doc.text(`Transaction ID: ${order.paymentId || 'N/A'}`, margin + 4, y + 19);
  doc.text(`Status: PAID`, pageWidth - margin - 4, y + 13, { align: 'right' });

  y += 28;

  // ── ORDER STATUS ──
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 83, 45);
  doc.text(`Order Status: ${order.orderStatus || 'Processing'}`, margin, y);

  y += 10;

  // ── THANK YOU NOTE ──
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(22, 101, 52);
  doc.text('"Thank you for choosing ALPHOVINS Global Agro Exports!"', pageWidth / 2, y, { align: 'center' });
  doc.text('For any queries, contact us at business.alphovins@gmail.com', pageWidth / 2, y + 6, { align: 'center' });

  y += 16;

  // ── FOOTER ──
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(130, 130, 130);
  doc.text('This is a computer-generated invoice and does not require a physical signature.', pageWidth / 2, y, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, y + 4, { align: 'center' });

  return doc;
}

export function downloadOrderInvoice(order) {
  try {
    const doc = generateOnlineOrderInvoicePDF(order);
    const orderId = order.id?.slice(-6)?.toUpperCase() || 'ORDER';
    const customerName = (order.customerDetails?.name || 'customer').replace(/\s+/g, '_');
    const filename = `Invoice_${orderId}_${customerName}.pdf`;
    const blob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const pdfWindow = window.open(blobUrl, '_blank');
    if (!pdfWindow) {
      saveAs(blob, filename);
    } else {
      pdfWindow.addEventListener('load', () => {
        try { pdfWindow.document.title = filename; } catch(e) {}
      });
    }
    setTimeout(() => {
      try { saveAs(blob, filename); } catch(e) {}
    }, 500);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } catch (err) {
    console.error('Invoice generation error:', err);
    alert('Failed to generate invoice. Please try again.');
  }
}
