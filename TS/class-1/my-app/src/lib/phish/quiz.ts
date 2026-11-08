export interface QuizItem {
  id: number;
  channel: "SMS" | "Email" | "URL";
  from: string;
  content: string;
  phishing: boolean;
  explanation: string;
}

// All examples are synthetic.
export const QUIZ: QuizItem[] = [
  { id: 1, channel: "SMS", from: "+8801912xxxxxx", content: "Your bKash account will be blocked today. Share the OTP we sent to keep it active.", phishing: true, explanation: "bKash never asks for your OTP. A personal number and a same-day deadline are both red flags." },
  { id: 2, channel: "Email", from: "registrar@pub.edu.bd", content: "The spring semester exam routine is now published on the official university portal.", phishing: false, explanation: "Official domain, no link to log in, no request for information — this is routine news." },
  { id: 3, channel: "URL", from: "Link in a group chat", content: "http://pub-edu-bd.login-portal.xyz/student", phishing: true, explanation: "The real domain is login-portal.xyz. 'pub-edu-bd' is just a subdomain disguise on a cheap TLD." },
  { id: 4, channel: "Email", from: "\"PUB Scholarship Cell\" <offers@scholar-grants.top>", content: "You are selected for a 100% scholarship. Pay a 1500 Tk processing fee within 24 hours.", phishing: true, explanation: "Display name claims the university, but the sender domain does not. Real scholarships do not charge fees." },
  { id: 5, channel: "SMS", from: "NAGAD", content: "Cash In Tk 2,000.00 from 01712xxxxxx successful. Balance Tk 3,450.00. TrxID 8HK2LQ9.", phishing: false, explanation: "A transaction receipt with no link and no request — typical genuine notification." },
  { id: 6, channel: "URL", from: "QR code on a poster", content: "https://bit.ly/3pubfee", phishing: true, explanation: "A shortener hides where you will land. Expand or verify it before trusting payment pages." },
  { id: 7, channel: "SMS", from: "+8801812xxxxxx", content: "অভিনন্দন! আপনি ৫০,০০০ টাকা লটারি জিতেছেন। পেতে ৫০০ টাকা পাঠান।", phishing: true, explanation: "Asking you to pay money to receive a prize is the oldest scam pattern." },
  { id: 8, channel: "URL", from: "Bank statement email", content: "https://www.dutchbanglabank.com/personal/cards", phishing: false, explanation: "Correct, well-known domain over HTTPS without any odd tricks." },
  { id: 9, channel: "Email", from: "it-support@pub.edu.bd", content: "Attached: Password_Reset_Form.pdf.exe — open and enter your current password.", phishing: true, explanation: "Double extension hides an executable. Even a real-looking sender can be spoofed or compromised." },
  { id: 10, channel: "URL", from: "SMS", content: "http://bkаsh.com/verify", phishing: true, explanation: "The 'а' is Cyrillic, not Latin. Look-alike characters create a fake copy of a trusted domain." },
];
