import { EmailClient } from "@azure/communication-email";

export async function sendEmail(to: string, subject: string, html: string) {
  const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("COMMUNICATION_SERVICES_CONNECTION_STRING is not defined");
  }
  const client = new EmailClient(connectionString);

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
