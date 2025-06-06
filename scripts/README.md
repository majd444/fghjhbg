# PDF and Document Text Extraction Service

This service extracts text content from various document formats including PDF, DOCX, TXT, CSV, and JSON files.

## Prerequisites

Install the required Python packages:

```bash
pip install flask pdfminer.six python-docx
```

## Running the Service

Start the extraction service:

```bash
python extract_text.py --port 5000
```

By default, the service runs on `127.0.0.1:5000`.

## API Usage

The service exposes a single endpoint:

### POST /extract

Extract text from a document.

**Request Body:**
```json
{
  "file_data": "base64_encoded_file_content",
  "file_name": "example.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "text": "Extracted text content...",
  "file_name": "example.pdf"
}
```

## Supported File Types

- `.pdf`: PDF documents (using pdfminer.six)
- `.docx`: Microsoft Word documents (using python-docx)
- `.txt`: Plain text files
- `.md`: Markdown files
- `.csv`: CSV files
- `.json`: JSON files

## Limitations

- Maximum file size: 10MB
- PDF extraction works best with text-based PDFs; scanned documents may not extract well
- No OCR capability for image-based content
