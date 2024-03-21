var vcard =
    "BEGIN:VCARD\n" + // metadata of the contact card
    "VERSION:3.0\n" +
    "FN:Im_JVallejo\n" + // full name
    "ORG:Web developer;\n" + // the organization of the contact
    "TEL;type=CELL;type=VOICE;waid=5213321485996:+5213321485996\n" + // WhatsApp ID + phone number
    "END:VCARD";

module.exports = vcard;
