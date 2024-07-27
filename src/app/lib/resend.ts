import { Resend as resend} from 'resend';

export const Resend = new resend(process.env.RESEND_API_KEY);