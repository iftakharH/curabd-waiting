const SHEET_NAME = 'curabd.io-waiting';

function doPost(e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error(
      'This script must be bound to the spreadsheet or use a container-bound deployment.',
    );
  }

  const sheet =
    spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];

  const values = getSubmissionValues(e);
  sheet.appendRow([
    new Date(),
    values.fullName || '',
    values.email || '',
    values.phone || '',
    values.role || '',
    values.district || '',
    values.source || 'curabd-waiting',
    values.submittedAt || '',
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('ok');
}

function getSubmissionValues(e) {
  if (e && e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }

  if (e && e.postData && e.postData.contents) {
    const raw = e.postData.contents;
    try {
      const params = new URLSearchParams(raw);
      const parsed = {};
      params.forEach((value, key) => {
        parsed[key] = value;
      });
      return parsed;
    } catch (error) {
      return {};
    }
  }

  return {};
}
