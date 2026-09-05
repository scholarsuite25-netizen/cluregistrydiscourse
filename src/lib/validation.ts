import { z } from "zod";

export const registrationSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(2, "First name required").max(60),
  middleName: z.string().optional(),
  surname: z.string().min(2, "Surname required").max(60),
  email: z.string().email("Valid email required").toLowerCase(),
  phone: z.string().min(7, "Phone required").max(20),
  institution: z.string().min(2, "Institution required").max(120),
  department: z.string().optional(),
  designation: z.string().optional(),
  participationMode: z.enum(["Physical", "Online"]),
  accessibility: z.string().optional(),
  consentEmail: z.literal(true),
  whatsappOptIn: z.boolean().default(false),
  pushOptIn: z.boolean().default(false),
  publicActivityOptIn: z.boolean().default(false),
  privacyAck: z.literal(true),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

// Nigeria-aware phone normalisation
export function normalizePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  const onlyDigits = digits.replace(/\D/g, "");
  if (onlyDigits.startsWith("0") && onlyDigits.length === 11) return "+234" + onlyDigits.slice(1);
  if (onlyDigits.startsWith("234") && onlyDigits.length >= 13) return "+" + onlyDigits;
  if (onlyDigits.length >= 10) return "+" + onlyDigits;
  return digits;
}

export function maskName(first: string, surname: string) {
  return `${first} ${surname.charAt(0).toUpperCase()}.`;
}

// secure access code generation (client fallback uses crypto)
export function generateAccessCode(len = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,O,0,1
  const arr = new Uint32Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(arr);
  else for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 100000);
  return Array.from(arr, (n) => alphabet[n % alphabet.length]).join("");
}
