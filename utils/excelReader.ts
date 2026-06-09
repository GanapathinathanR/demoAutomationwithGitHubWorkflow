// ============================================================
// excelReader.ts — Reads test data from Excel file
//
// This file opens the Excel file and returns the data
// so that test files can use it instead of JSON
// ============================================================

import * as XLSX from "xlsx";
import * as path from "path";

// ─── Interfaces (shape of each row in Excel) ─────────────────

// This is the shape of the loginValid sheet row
export interface LoginData {
  email:    string;
  password: string;
}

// This is the shape of the loginInvalid sheet row
export interface InvalidLoginData {
  email:    string;
  password: string;
}

// ─── Main Reader Function ─────────────────────────────────────

/**
 * Reads the Excel file and returns login data.
 * The Excel file has two sheets:
 *   Sheet 1 - "LoginValid"   → valid email and password
 *   Sheet 2 - "LoginInvalid" → wrong email and password
 */
export function readExcelData() {

  // Step 1: Build the full path to the Excel file
  // __dirname = current folder (utils/)
  // We go one level up (..) to reach project root, then into test-data/
  const filePath = path.join(__dirname, "../test-data/testdata.xlsx");

  // Step 2: Open the Excel file
  const workbook = XLSX.readFile(filePath);

  // Step 3: Read "LoginValid" sheet — first row is the valid login data
  const loginValidSheet = workbook.Sheets["LoginValid"];
  const loginValidRows: LoginData[] = XLSX.utils.sheet_to_json(loginValidSheet);
  const loginValid = loginValidRows[0]; // take the first row

  // Step 4: Read "LoginInvalid" sheet — first row is the invalid login data
  const loginInvalidSheet = workbook.Sheets["LoginInvalid"];
  const loginInvalidRows: InvalidLoginData[] = XLSX.utils.sheet_to_json(loginInvalidSheet);
  const loginInvalid = loginInvalidRows[0]; // take the first row

  // Step 5: Return both so the test file can use them
  return { loginValid, loginInvalid };
}
