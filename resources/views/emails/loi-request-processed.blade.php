<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your LOI request has been processed</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #f4f6f8; color: #17212b; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff;">
        <tr>
            <td style="padding: 28px 32px; background-color: #123b65; color: #ffffff;">
                <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Schools Division Office of the City of Ilagan</p>
                <h1 style="margin: 0; font-size: 22px; line-height: 1.3;">LOI Request Update</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 32px; font-size: 15px; line-height: 1.65;">
                <p style="margin: 0 0 18px;">Dear {{ $employeeName }},</p>
                <p style="margin: 0 0 18px;">This is to inform you that your Letter of Introduction request has been processed by the Schools Division Office of the City of Ilagan.</p>

                <table role="presentation" style="width: 100%; margin: 22px 0; border-collapse: collapse; background-color: #f4f6f8;">
                    <tr>
                        <td style="padding: 14px 16px; color: #526171; font-size: 13px;">Position</td>
                        <td style="padding: 14px 16px; font-size: 13px; font-weight: 600;">{{ $loiRequest->position }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 14px 16px; color: #526171; font-size: 13px;">School</td>
                        <td style="padding: 14px 16px; font-size: 13px; font-weight: 600;">{{ $loiRequest->school }}</td>
                    </tr>
                </table>

                <p style="margin: 0 0 18px;">Please contact the office if you need assistance regarding your request.</p>
                <p style="margin: 0;">Sincerely,<br><strong>Schools Division Office of the City of Ilagan</strong></p>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px 32px; border-top: 1px solid #e5e9ed; color: #667482; font-size: 12px;">
                This is an automated notification. Please do not reply to this email.
            </td>
        </tr>
    </table>
</body>
</html>
