import type { InputKind } from "@/lib/phish/types";

export const SAMPLES: Record<InputKind, { label: string; value: string }[]> = {
  url: [
    { label: "Suspicious", value: "http://secure-login.pub-edu.verify-account.xyz/@student/portal" },
    { label: "Safe", value: "https://www.pub.edu.bd/notice" },
  ],
  email: [
    {
      label: "Phish",
      value: `From: "bKash Support" <support@bkash-help.top>
Reply-To: claims@freemail-box.com
Subject: Urgent: account suspended
Authentication-Results: mx.pub.edu.bd; spf=fail; dkim=none; dmarc=fail
Content-Disposition: attachment; filename="Verify_Form.pdf.exe"

Dear customer, unusual activity detected. Verify your PIN within 24 hours or your account will be locked.
Click here: http://bkash-verify.xyz/login`,
    },
    {
      label: "Genuine",
      value: `From: Registrar <registrar@pub.edu.bd>
Subject: Exam routine published
Authentication-Results: mx.pub.edu.bd; spf=pass; dkim=pass; dmarc=pass

The final exam routine for this semester is now available on the student portal.`,
    },
  ],
  sms: [
    { label: "Bangla scam", value: "অভিনন্দন! আপনি ২৫০০০ টাকা পুরস্কার জিতেছেন। আজই পিন দিয়ে যাচাই করুন http://nagad-bonus.top" },
    { label: "Normal", value: "Class test for CSE 311 moved to Thursday 10am, room 402." },
  ],
};
