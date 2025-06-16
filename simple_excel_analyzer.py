#!/usr/bin/env python3
"""
Simple Excel analyzer using built-in zipfile to read .xlsx structure
"""
import zipfile
import xml.etree.ElementTree as ET
import json
import os

def analyze_excel_structure(file_path):
    """Analyze Excel file structure using zipfile"""
    
    print(f"📊 Analyzing Excel file: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return None
    
    try:
        # Excel files are ZIP archives
        with zipfile.ZipFile(file_path, 'r') as zip_file:
            print("\n📁 ZIP Contents:")
            file_list = zip_file.namelist()
            
            for file in sorted(file_list):
                print(f"  {file}")
            
            # Read workbook.xml to get sheet information
            if 'xl/workbook.xml' in file_list:
                print("\n📋 Reading workbook structure...")
                
                workbook_xml = zip_file.read('xl/workbook.xml')
                root = ET.fromstring(workbook_xml)
                
                # Find sheet names
                sheets = []
                for sheet in root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet'):
                    sheet_info = {
                        'name': sheet.get('name'),
                        'sheet_id': sheet.get('sheetId'),
                        'r_id': sheet.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                    }
                    sheets.append(sheet_info)
                
                print(f"\n🗂️  Found {len(sheets)} sheets:")
                for i, sheet in enumerate(sheets, 1):
                    print(f"  {i}. {sheet['name']} (ID: {sheet['sheet_id']})")
                
                # Look for shared strings
                if 'xl/sharedStrings.xml' in file_list:
                    print(f"\n📝 Shared strings file found")
                    shared_strings_xml = zip_file.read('xl/sharedStrings.xml')
                    strings_root = ET.fromstring(shared_strings_xml)
                    
                    # Count shared strings
                    string_count = len(strings_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'))
                    print(f"  Total shared strings: {string_count}")
                
                # Check for worksheets
                worksheet_files = [f for f in file_list if f.startswith('xl/worksheets/')]
                print(f"\n📊 Found {len(worksheet_files)} worksheet files:")
                for ws_file in worksheet_files:
                    print(f"  {ws_file}")
                
                # Try to read first worksheet for sample
                if worksheet_files:
                    first_worksheet = worksheet_files[0]
                    print(f"\n🔍 Analyzing first worksheet: {first_worksheet}")
                    
                    ws_xml = zip_file.read(first_worksheet)
                    ws_root = ET.fromstring(ws_xml)
                    
                    # Count rows and cells
                    rows = ws_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
                    total_cells = len(ws_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'))
                    
                    print(f"  Rows: {len(rows)}")
                    print(f"  Total cells: {total_cells}")
                    
                    # Look for formulas
                    formulas = ws_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}f')
                    print(f"  Formulas found: {len(formulas)}")
                    
                    if formulas:
                        print("  Sample formulas:")
                        for i, formula in enumerate(formulas[:5]):  # First 5 formulas
                            if formula.text:
                                print(f"    {i+1}. {formula.text}")
                
                return {
                    'total_sheets': len(sheets),
                    'sheet_names': [s['name'] for s in sheets],
                    'worksheet_files': len(worksheet_files),
                    'total_files': len(file_list)
                }
            
            else:
                print("❌ Could not find workbook.xml")
                return None
                
    except Exception as e:
        print(f"❌ Error analyzing file: {e}")
        return None

def main():
    file_path = "/Users/kevin/Downloads/25,000,000.xlsx"
    
    print("🚀 Starting Simple Excel Analysis")
    print("=" * 50)
    
    result = analyze_excel_structure(file_path)
    
    if result:
        print(f"\n✅ Analysis Summary:")
        print(f"  📊 Total sheets: {result['total_sheets']}")
        print(f"  📁 Total files in archive: {result['total_files']}")
        print(f"  🗂️  Sheet names: {', '.join(result['sheet_names'])}")
        
        # Save to file
        output_file = "/Users/kevin/backups/awsready_20250524/prop-ie-aws-app/excel_structure.json"
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"\n📄 Results saved to: {output_file}")
    else:
        print("❌ Analysis failed")

if __name__ == "__main__":
    main()