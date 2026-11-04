import assert from 'node:assert/strict';
import { extractDocumentText } from '../backend/src/knowledge/documentExtractor.js';
import { ingestDocument, deleteDocument, listDocuments } from '../backend/src/knowledge/documentService.js';
import { answerDocumentQuestion } from '../backend/src/knowledge/documentQaService.js';

// Construct valid 2-page PDF
function buildTwoPagePdf() {
  const content1 = 'BT /F1 14 Tf 50 700 Td (NOVA Architecture Overview. Section one covers core holographic design.) Tj ET';
  const content2 = 'BT /F1 14 Tf 50 700 Td (Security Protocol. The quantum authorization key is ALPHA-OMEGA-9021.) Tj ET';

  const pdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj
4 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj
5 0 obj << /Length ${content1.length} >> stream
${content1}
endstream endobj
6 0 obj << /Length ${content2.length} >> stream
${content2}
endstream endobj
7 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 8
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000227 00000 n 
0000000339 00000 n 
0000000450 00000 n 
0000000560 00000 n 
trailer << /Size 8 /Root 1 0 R >>
startxref
630
%%EOF`;

  return Buffer.from(pdf, 'utf-8');
}

async function runTest() {
  console.log('--- TESTING REAL TWO-PAGE PDF INGESTION & PAGE 2 CITATION ---');

  const pdfBuffer = buildTwoPagePdf();
  
  // 1. Text extraction check
  const extracted = await extractDocumentText(pdfBuffer, 'application/pdf', 'quantum-specs.pdf');
  console.log(`Extracted pages: ${extracted.pageCount}`);
  assert.equal(extracted.pageCount, 2, 'Expected 2 pages extracted');
  assert.equal(extracted.sections.length, 2, 'Expected 2 sections extracted');
  assert.equal(extracted.sections[0].pageNumber, 1);
  assert.equal(extracted.sections[1].pageNumber, 2);
  console.log('Page 1 text:', extracted.sections[0].text);
  console.log('Page 2 text:', extracted.sections[1].text);
  assert.ok(extracted.sections[1].text.includes('ALPHA-OMEGA-9021'));

  // 2. Ingestion into DocumentService
  const ingested = await ingestDocument(pdfBuffer, 'quantum-specs.pdf', 'application/pdf');
  const docId = ingested.documentId || ingested.id;
  console.log('Ingested document:', docId, 'Chunks:', ingested.chunkCount);

  try {
    // 3. Query knowledge answered exclusively on Page 2
    const qaResult = await answerDocumentQuestion('What is the quantum authorization key?');
    console.log('QA Result:');
    console.log(' - Source Type:', qaResult.sourceType);
    console.log(' - Document Supported:', qaResult.isDocumentSupported);
    console.log(' - Answer:', qaResult.answer);
    console.log(' - Citations count:', qaResult.citations.length);
    console.log(' - Top Citation:', qaResult.citations[0]);

    assert.equal(qaResult.isDocumentSupported, true, 'Must be document-supported');
    assert.equal(qaResult.sourceType, 'document_supported');
    assert.ok(qaResult.citations.length > 0, 'Must include citations');
    assert.equal(qaResult.citations[0].page || qaResult.citations[0].pageNumber, 2, 'Citation MUST reference Page 2');
    assert.ok(qaResult.answer.includes('page 2') || qaResult.answer.includes('Page 2'), 'Must reference Page 2');
    assert.ok(qaResult.answer.includes('ALPHA-OMEGA-9021'), 'Answer must include exact fact from Page 2');

    console.log('✓ PASS: Document question answered with verified Page 2 citation!');
  } finally {
    // 4. Delete document and purge index
    await deleteDocument(docId);
    const docs = await listDocuments();
    assert.ok(!docs.some(d => (d.id || d.documentId) === docId), 'Document must be purged from library');
    console.log('✓ PASS: Test document successfully deleted and purged from retrieval index.');
  }

  console.log('====================================================');
  console.log('TWO-PAGE PDF INGESTION & CITATION VERIFIED 100%');
  console.log('====================================================');
}

runTest().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
