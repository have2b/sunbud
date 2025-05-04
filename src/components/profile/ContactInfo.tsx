"use client";

interface ContactInfoProps {
  email?: string;
  phone?: string;
}

const ContactInfo = ({ email, phone }: ContactInfoProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Contact Information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {email && (
          <div className="bg-muted flex items-center justify-between rounded-lg p-4">
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </span>
            <span className="font-medium">{email}</span>
          </div>
        )}
        {phone && (
          <div className="bg-muted flex items-center justify-between rounded-lg p-4">
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Phone
            </span>
            <span className="font-medium">{phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
