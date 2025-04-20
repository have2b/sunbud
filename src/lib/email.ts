import { EmailClient } from "@azure/communication-email";

const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING!;

const client = new EmailClient(connectionString);

export async function sendEmail(to: string, subject: string, html: string) {
  const emailMessage = {
    senderAddress:
      "DoNotReply@6bc344f4-cea3-4f8a-936f-d5cf01635e60.azurecomm.net",
    content: {
      subject,
      plainText: html,
      html,
    },
    recipients: {
      to: [{ address: to }],
    },
  };

  const poller = await client.beginSend(emailMessage);
  const result = await poller.pollUntilDone();
  return result;
}
