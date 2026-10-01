/**
 * Wedding RSVP — Google Apps Script Backend
 * ==========================================
 * Deploy this as a Web App (see README for steps).
 * It will receive RSVP submissions and append them to your Google Sheet.
 *
 * SETUP:
 *   1. Open https://script.google.com and create a new project.
 *   2. Paste this entire file into the editor.
 *   3. Replace SHEET_ID below with your Google Sheet's ID.
 *   4. Deploy → New Deployment → Web App → Anyone can access → Deploy.
 *   5. Copy the Web App URL into index.html (SCRIPT_URL variable).
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
var SHEET_ID   = "YOUR_GOOGLE_SHEET_ID_HERE"; // e.g. "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
var SHEET_NAME = "RSVPs";                      // Tab name inside your spreadsheet
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Handle CORS preflight (GET requests from browsers).
 * Also useful for testing: open the Web App URL in a browser.
 */
function doGet(e) {
  // If RSVP parameters are present, save the submission
  if (e.parameter && e.parameter.name) {
    return saveRSVP(e.parameter);
  }
  // Otherwise return a status check
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Wedding RSVP backend is live! 🎉" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle RSVP form submission (POST fallback).
 */
function doPost(e) {
  var params = (e.parameter && e.parameter.name) ? e.parameter : null;
  if (!params) {
    try { params = JSON.parse(e.postData.contents); } catch(err) {}
  }
  return saveRSVP(params || {});
}

/**
 * Save an RSVP to the Google Sheet.
 */
function saveRSVP(data) {
  try {
    var name      = (data.name                            || "").trim();
    var contact   = (data.contact || data.phone || data.email || "").trim();
    var attending = (data.attending                       || "").trim();
    var guests    = (data.guests                          || "0").trim();
    var message   = (data.message                         || "").trim();

    // Basic validation
    if (!name || !contact || !attending) {
      return respond(400, "Missing required fields.");
    }

    // Get or create the sheet
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Add header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Contact Number",
        "Attending",
        "# Guests",
        "Message / Notes"
      ]);

      // Style the header row
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#f4a7b9");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);

      // Set column widths
      sheet.setColumnWidth(1, 180); // Timestamp
      sheet.setColumnWidth(2, 180); // Name
      sheet.setColumnWidth(3, 200); // Contact Number
      sheet.setColumnWidth(4, 100); // Attending
      sheet.setColumnWidth(5, 80);  // Guests
      sheet.setColumnWidth(6, 300); // Message
    }

    // Append the RSVP row
    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss"
    );

    sheet.appendRow([timestamp, name, contact, attending, guests, message]);

    // Color-code the new row based on attendance
    var newRow   = sheet.getLastRow();
    var rowRange = sheet.getRange(newRow, 1, 1, 6);
    if (attending === "Yes") {
      rowRange.setBackground("#e6f4ea"); // light green
    } else {
      rowRange.setBackground("#fce8e6"); // light red
    }

    return respond(200, "RSVP saved successfully!");

  } catch (err) {
    Logger.log("Error: " + err.toString());
    return respond(500, "Server error: " + err.toString());
  }
}

/**
 * Helper: return a JSON response with CORS headers.
 */
function respond(statusCode, message) {
  var output = ContentService
    .createTextOutput(JSON.stringify({ status: statusCode, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
