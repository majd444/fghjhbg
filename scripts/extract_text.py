#!/usr/bin/env python3

import os
import sys
import traceback
import argparse

# Print Python version and path for debugging
print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")

# Try to import the required libraries, with helpful error messages if missing
try:
    from pdfminer.high_level import extract_text
except ImportError:
    print("Error: pdfminer.six not installed. Please run: pip install pdfminer.six")
    sys.exit(1)

# Simple function to extract text from PDF
def extract_pdf_text(pdf_path):
    try:
        print(f"Attempting to extract text from: {pdf_path}")
        if not os.path.exists(pdf_path):
            print(f"Error: File '{pdf_path}' not found.")
            return f"Error: File '{pdf_path}' not found."
        
        # Check file size (10MB limit)
        file_size = os.path.getsize(pdf_path)
        size_kb = file_size / 1024
        print(f"File size: {size_kb:.2f} KB")
        
        if file_size > 10 * 1024 * 1024:
            print("Error: File size exceeds 10MB limit.")
            return "Error: File size exceeds 10MB limit."
        
        # Extract text using pdfminer.six
        print("Starting text extraction...")
        extracted_text = extract_text(pdf_path)
        print(f"Extraction complete. Extracted {len(extracted_text)} characters")
        
        if not extracted_text or len(extracted_text.strip()) == 0:
            print("Warning: No text was extracted from the PDF.")
            return "No text could be extracted from this PDF. It may be image-based or encrypted."
        
        return extracted_text
    except Exception as e:
        print(f"Error extracting text: {e}")
        traceback.print_exc()
        return f"Error extracting text: {str(e)}"

def main():
    parser = argparse.ArgumentParser(description='Extract text from PDF files.')
    parser.add_argument('input_file', help='Path to the PDF file')
    parser.add_argument('-o', '--output', help='Path to the output text file')
    args = parser.parse_args()

    # Extract text
    extracted_text = extract_pdf_text(args.input_file)
    
    # Output the text
    if args.output:
        try:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(extracted_text)
            print(f"Text extracted and saved to '{args.output}'")
        except Exception as e:
            print(f"Error writing to output file: {e}")
            traceback.print_exc()
    else:
        print("\n--- EXTRACTED TEXT ---\n")
        print(extracted_text)
        print("\n--- END OF EXTRACTED TEXT ---\n")

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"Unhandled error: {e}")
        traceback.print_exc()
        sys.exit(1)
