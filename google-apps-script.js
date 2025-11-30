/**
 * Google Apps Script for Engagement Party RSVP Form
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Copy and paste this entire code
 * 4. Save the project
 * 5. Deploy as Web App (Deploy > New deployment)
 * 6. Set "Execute as" to "Me" and "Who has access" to "Anyone"
 * 7. Copy the Web App URL and paste it in script.js
 */

const RSVP_CONFIG = {
  emailConfirmation: {
    enabled: true,
    subject: 'We received your RSVP!',
    fromNames: 'Sneha & Aaditya',
    organizerName: 'Sneha And Aaditya',
    organizerEmail: 'aaditya.kv@gmail.com',
    eventDetails: {
      title: 'Sneha & Aaditya\'s Engagement Party',
      description: 'Join us to celebrate our engagement! Details at https://snehaandaaditya.com',
      location: '2806 Sentry Oak Way, Sugar Land, TX 77479',
      startTime: new Date('2026-03-21T00:00:00-05:00'), // Central Time (CDT)
      endTime: new Date('2026-03-22T00:00:00-05:00'),
      allDay: true
    }
  },
  messaging: {
    enabled: true, // Flip to true after configuring Twilio/SMS credentials
    defaultCountryCode: '+1',
    channel: 'sms', // "whatsapp" or "sms"
    fromNumber: '+18332933146', // Replace with your Twilio SMS number in E.164 format
    messageTemplate: 'Hi {{name}}, we have your RSVP for Sneha & Aaditya\'s Engagement Party on March 21, 2026. More details to come on snehaandaaditya.com! Let us know if anything changes!'
  },
  // Optional: use a secondary calendar by ID; leave blank to skip calendar creation
  calendarId: '',
  timeZone: 'America/Chicago'
};

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    Logger.log('Incoming RSVP payload: %s', JSON.stringify(data));

    const timestamp = data.timestamp || new Date().toLocaleString();
    const email = data.email || '';
    const phone = data.phone || '';
    const attendance = data.attendance || '';
    const dietary = data.dietary || '';
    const message = data.message || '';

    // Add row for the main person submitting the form
    const mainRowData = [
      timestamp,
      data.name || '',
      email,
      phone,
      attendance,
      data.guests || '',
      dietary,
      message
    ];
    sheet.appendRow(mainRowData);
    Logger.log('Row appended for main person: %s', data.name || 'unknown name');

    // Add additional rows for each guest (using same email as submitter)
    if (data.guests) {
      const guestNames = data.guests.split(',').map(name => name.trim()).filter(name => name !== '');
      for (const guestName of guestNames) {
        const guestRowData = [
          timestamp,
          guestName,
          email,
          phone,
          attendance,
          '', // Guest rows have empty guests field (only main submitter tracks the full guest list)
          dietary,
          message
        ];
        sheet.appendRow(guestRowData);
        Logger.log('Row appended for guest: %s', guestName);
      }
    }

    let emailResult;
    if (RSVP_CONFIG.emailConfirmation.enabled) {
      Logger.log('Email confirmations enabled; sending to %s', data.email || 'no email provided');
      try {
        emailResult = sendConfirmationEmail(data);
      } catch (emailError) {
        Logger.log('Error sending confirmation email: %s', emailError);
        emailResult = { success: false, message: emailError.toString() };
      }
    } else {
      Logger.log('Email confirmations disabled; skipping.');
      emailResult = { success: false, message: 'Email confirmations disabled' };
    }

    let messagingResult;
    if (RSVP_CONFIG.messaging.enabled) {
      Logger.log('Messaging enabled; sending to %s', data.phone || 'no phone provided');
      try {
        messagingResult = sendWhatsappOrSms(data);
      } catch (smsError) {
        Logger.log('Error sending text message: %s', smsError);
        messagingResult = { success: false, message: smsError.toString() };
      }
    } else {
      Logger.log('Messaging disabled; skipping.');
      messagingResult = { success: false, message: 'Messaging disabled' };
    }

    return buildJsonResponse({
      status: 'success',
      message: 'RSVP submitted successfully',
      email: emailResult,
      messaging: messagingResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    Logger.log('Error in doPost: %s', error);
    return buildJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

function sendConfirmationEmail(data) {
  if (!data.email) {
    Logger.log('No email provided; skipping confirmation email.');
    return { success: false, message: 'No email address provided' };
  }
  Logger.log('Preparing confirmation email for %s', data.email);

  const guestName = data.name || 'there';
  const eventDetails = RSVP_CONFIG.emailConfirmation.eventDetails;
  const inviteBlob = buildCalendarInvite(eventDetails, {
    name: data.name || '',
    email: data.email || ''
  });
  const dateText = Utilities.formatDate(eventDetails.startTime, RSVP_CONFIG.timeZone, 'EEEE, MMMM d, yyyy');
  const timeText = eventDetails.allDay
    ? 'All day (Central Time)'
    : `${Utilities.formatDate(eventDetails.startTime, RSVP_CONFIG.timeZone, 'h:mma')} - ${Utilities.formatDate(eventDetails.endTime, RSVP_CONFIG.timeZone, 'h:mma z')}`;
  const htmlBody = [
    `Hi ${guestName},`,
    ' ',
    'Thank you for RSVPing to our engagement celebration! We can’t wait to celebrate with you.',
    ' ',
    `<strong>Event:</strong> ${eventDetails.title}`,
    `<strong>Date:</strong> ${dateText}`,
    `<strong>Time:</strong> ${timeText}`,
    `<strong>Location:</strong> ${eventDetails.location}`,
    ' ',
    'We included a calendar invite so you can add the details with one click.',
    'Also, please keep an eye on <a href="https://snehaandaaditya.com">snehaandaaditya.com</a> for any updates as we get closer to the date!',
    ' ',
    `With love,<br>${RSVP_CONFIG.emailConfirmation.fromNames}`
  ].join('<br>');

  MailApp.sendEmail({
    to: data.email,
    subject: RSVP_CONFIG.emailConfirmation.subject,
    htmlBody: htmlBody,
    body: htmlBody.replace(/<br>/g, '\n').replace(/<[^>]+>/g, ''),
    attachments: [inviteBlob]
  });
  Logger.log('Confirmation email sent to %s', data.email);

  let calendarResult = 'skipped';
  if (RSVP_CONFIG.calendarId) {
    Logger.log('Adding %s to shared calendar %s', data.email, RSVP_CONFIG.calendarId);
    addGuestToCalendarEvent(data.email, eventDetails);
    calendarResult = 'invite sent';
  } else {
    Logger.log('No calendarId configured; skipping Calendar event.');
  }

  return {
    success: true,
    message: 'Confirmation email sent',
    calendarInvite: calendarResult
  };
}

function buildCalendarInvite(eventDetails, guest) {
  const formatted = {
    start: eventDetails.allDay ? formatDateForICSDay(eventDetails.startTime) : formatDateForICS(eventDetails.startTime),
    end: eventDetails.allDay ? formatDateForICSDay(eventDetails.endTime) : formatDateForICS(eventDetails.endTime),
    stamp: formatDateForICS(new Date()),
    uid: Utilities.getUuid()
  };
  const organizerEmail = RSVP_CONFIG.emailConfirmation.organizerEmail || Session.getActiveUser().getEmail();
  const organizerName = RSVP_CONFIG.emailConfirmation.organizerName || RSVP_CONFIG.emailConfirmation.fromNames || 'Event Host';
  const guestEmail = guest && guest.email ? guest.email : '';
  const guestName = guest && guest.name ? guest.name : 'Guest';

  const lines = [
    'BEGIN:VCALENDAR',
    'PRODID:-//Engagement Party RSVP//EN',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${formatted.uid}`,
    `DTSTAMP:${formatted.stamp}`,
    eventDetails.allDay ? `DTSTART;VALUE=DATE:${formatted.start}` : `DTSTART:${formatted.start}`,
    eventDetails.allDay ? `DTEND;VALUE=DATE:${formatted.end}` : `DTEND:${formatted.end}`,
    `ORGANIZER;CN=${escapeIcsText(organizerName)}:mailto:${organizerEmail}`,
    `SUMMARY:${escapeIcsText(eventDetails.title)}`,
    `DESCRIPTION:${escapeIcsText(eventDetails.description)}`,
    `LOCATION:${escapeIcsText(eventDetails.location)}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    guestEmail ? `ATTENDEE;CN=${escapeIcsText(guestName)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${guestEmail}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const filteredLines = lines.filter(Boolean);

  return Utilities.newBlob(filteredLines.join('\r\n'), 'text/calendar', 'engagement-party.ics');
}

function formatDateForICS(date) {
  return Utilities.formatDate(new Date(date), 'UTC', "yyyyMMdd'T'HHmmss'Z'");
}

function formatDateForICSDay(date) {
  return Utilities.formatDate(new Date(date), 'UTC', 'yyyyMMdd');
}

function escapeIcsText(text) {
  return (text || '')
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

function addGuestToCalendarEvent(email, eventDetails) {
  const calendar = RSVP_CONFIG.calendarId
    ? CalendarApp.getCalendarById(RSVP_CONFIG.calendarId)
    : CalendarApp.getDefaultCalendar();

  if (!calendar) return;

  const event = eventDetails.allDay
    ? calendar.createAllDayEvent(eventDetails.title, new Date(eventDetails.startTime), {
        description: eventDetails.description,
        location: eventDetails.location,
        guests: [email],
        sendInvites: true
      })
    : calendar.createEvent(
        eventDetails.title,
        new Date(eventDetails.startTime),
        new Date(eventDetails.endTime),
        {
          location: eventDetails.location,
          description: eventDetails.description,
          guests: [email],
          sendInvites: true
        }
      );

  Logger.log('Calendar event created for %s', email);
}

function sendWhatsappOrSms(data) {
  if (!data.phone) {
    Logger.log('No phone number provided; skipping messaging.');
    return { success: false, message: 'No phone number provided' };
  }

  const phone = normalizePhoneNumber(data.phone, RSVP_CONFIG.messaging.defaultCountryCode);
  const credentials = getTwilioCredentials();

  if (!credentials.accountSid || !credentials.authToken) {
    Logger.log('Missing Twilio credentials; aborting SMS send.');
    return { success: false, message: 'Missing Twilio credentials' };
  }
  Logger.log('Sending %s message to %s', RSVP_CONFIG.messaging.channel.toUpperCase(), phone);

  const channelPrefix = RSVP_CONFIG.messaging.channel === 'whatsapp' ? 'whatsapp:' : '';
  const payload = {
    To: channelPrefix + phone,
    From: RSVP_CONFIG.messaging.fromNumber,
    Body: RSVP_CONFIG.messaging.messageTemplate.replace('{{name}}', data.name || 'there')
  };

  const response = UrlFetchApp.fetch(`https://api.twilio.com/2010-04-01/Accounts/${credentials.accountSid}/Messages.json`, {
    method: 'post',
    payload: payload,
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Basic ' + Utilities.base64Encode(`${credentials.accountSid}:${credentials.authToken}`)
    }
  });

  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  Logger.log(`Twilio response for ${data.phone}: ${responseCode} - ${responseBody}`);

  return {
    success: responseCode >= 200 && responseCode < 300,
    message: responseCode >= 200 && responseCode < 300 ? 'Message sent successfully' : 'Twilio returned an error',
    responseCode: responseCode,
    responseBody: responseBody
  };
}

function getTwilioCredentials() {
  const props = PropertiesService.getScriptProperties();
  return {
    accountSid: props.getProperty('TWILIO_ACCOUNT_SID'),
    authToken: props.getProperty('TWILIO_AUTH_TOKEN')
  };
}

function normalizePhoneNumber(raw, defaultCountryCode) {
  if (!raw) return '';
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  return `${defaultCountryCode}${digits}`;
}

function buildJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify the script works
function doGet(e) {
  return ContentService.createTextOutput('RSVP Form Handler is active!');
}
