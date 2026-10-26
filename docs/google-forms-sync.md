# Requested module: manual entry and Google Forms sync

`Add Request` saves a pending request. `Sync Google Forms` reads the configured response Sheet only when clicked. Both actions require the existing authenticated admin session. No background task is used.

## Current sheet

Spreadsheet ID: `1bo2z6_0v9yxYGePfqwB2iwlR9pdFfgrQGwhte1ewyDI`

The supplied Sheet was already readable through its shared link, so this local installation uses `GOOGLE_SHEETS_ACCESS_MODE=public`. The app does not change sharing permissions. Keep employee data access restricted where possible; service-account mode supports a private Sheet.

Expected columns match the supplied Form: Timestamp, First Name: eg. (Juan), Middle Initial: eg. (D.), Last Name eg. (Dela Cruz), Gender, School, Position : (Teacher I). Column order does not matter. Email / Email Address and middle name are optional. Add email collection in Google Forms to supply addresses for notifications. Make Gender a required multiple-choice question with Male and Female options (case differences are accepted). Missing or other values are reported for correction. Sync can fill missing gender on an unambiguous existing request; it preserves known gender, other details and status. No duplicate request is created.

Each employee can have one request across Pending, Processing and Completed. Sync and manual entry compare first name, middle initial and last name, ignoring capitalization and extra spaces. A full middle name and its initial match. A later submission date, changed school, position or email does not create another request for that name. Existing requests and statuses are preserved. The database `google_source_key` also keeps previously imported submissions from being imported again. Sheet rows are never deleted or modified.

Matching is based on names because the Form has no unique employee ID. Use consistent names and middle initials: spelling changes or an omitted initial can miss a match, and employees with identical names and initials cannot be distinguished. Add an employee ID field if those cases need reliable identification. Sync and manual saves share a local lock to prevent simultaneous duplicate creation.

Blank rows are ignored. Invalid rows are skipped with row numbers and field errors shown in the sync result; correct those rows and sync again. Names accept letters (including accents), spaces, apostrophes, hyphens and periods, but not digits. A column labelled Middle Initial accepts one letter with an optional period; it can be blank. A Middle Name column accepts full names. School and position are checked for presence and length, not against a school/position directory.

The supplied Sheet uses day/month/year timestamps, such as `21/10/2026 14:56:01`. Set `GOOGLE_SHEETS_DATE_FORMAT=d/m/Y` (the default). A month-first Sheet must explicitly use `m/d/Y`. The importer never guesses ambiguous dates such as `05/10/2026`. Impossible dates are rejected. Service-account mode uses Google's numeric dates, independent of display locale. Dates are saved as `YYYY-MM-DD` in `request_date`; no migration change is needed.

## Private Sheet setup

1. Enable Google Sheets API in a Google Cloud project.
2. Create a service account and its JSON key. No project-wide IAM role or domain delegation is required just to read a Sheet shared with it.
3. Save the JSON outside `public/`, preferably `storage/app/private/google-service-account.json` (git-ignored).
4. Share only the response Sheet with the JSON's `client_email` as Viewer.
5. Set `.env`:

```dotenv
GOOGLE_SHEETS_SPREADSHEET_ID=1bo2z6_0v9yxYGePfqwB2iwlR9pdFfgrQGwhte1ewyDI
GOOGLE_SHEETS_TAB_ID=
GOOGLE_SHEETS_DATE_FORMAT=d/m/Y
GOOGLE_SHEETS_ACCESS_MODE=service_account
GOOGLE_SHEETS_CREDENTIALS="C:/xampp/htdocs/sdo-loi-system/storage/app/private/google-service-account.json"
```

Leave `GOOGLE_SHEETS_TAB_ID` blank to read the first tab (the supplied link's default), or set it to the response tab's `gid` from its URL. Keep this selection consistent after importing; switching tabs changes submission identities. Run `php artisan config:clear`, then click Sync Google Forms. No key is sent to the browser. The integration uses only the read-only Sheets scope.

This Windows installation needed its trusted root certificates exported as a PEM bundle for PHP HTTPS. `GOOGLE_SHEETS_CA_BUNDLE` points to that local, git-ignored bundle. On another machine, leave this unset if PHP already has a working CA bundle. Never disable certificate verification.

For deployment: install Composer dependencies, run `php artisan migrate`, and `npm run build`.

## Seeder

`php artisan db:seed --class=LoiRequestSeeder` imports responses from this configured Sheet and also creates the existing sample requests. It shares duplicate prevention with the Requested module's sync button. Rerunning this seeder skips existing sample requests and previously imported responses, preserving their current status. It needs internet access; connection errors stop the seeder with an error. `DatabaseSeeder` already calls this seeder.

References: [Google service accounts](https://developers.google.com/identity/protocols/oauth2/service-account), [reading Sheet values](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/get).

## Gender in letters

Manual entry requires Male or Female. The shared React PDF document uses MR./MS. with the bold full name in the introduction, and Mr./Ms. with the regular-weight surname in the acknowledgment. Missing gender on legacy records produces no title rather than assuming one. Fill Gender on the original Sheet response and sync to complete those records. Editing a create-table migration does not update an existing database; add the gender column without resetting requests if it is absent.

## One LOI document layout

Edit `resources/js/Pages/Requested/Partials/RequestLetterPrint.jsx` for all LOI layout changes. This is a native `@react-pdf/renderer` document using Document, Page, Text, View and Image. Edit each element’s inline `style={{ ... }}` object; measurements are PDF points (72 points = 1 inch). It uses the local Times New Roman font files in `public/fonts/loi/`.

Print and View PDF both generate this same document with selectable text on 8.5 x 13 inch paper. View PDF opens a new tab without downloading automatically. Print loads the generated PDF in an invisible iframe on the current page and requests the browser print dialog, without opening a PDF tab. This requires a browser that supports printing embedded PDFs; failures display an error instead of opening another tab. The standalone local testing window displays the same document with PDFViewer and updates when the JSX is saved. No Blade template, HTML screenshot capture or separate server PDF route is used. Generation speed has not been benchmarked.
