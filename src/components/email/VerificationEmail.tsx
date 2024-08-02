import * as React from 'react';

export interface EmailTemplateProps {
  username: string,
  code: string,
  email: string
}

export const verificationEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  code,
  email
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <p>Thanks for sign up. Please Verfify your account {email} with the folwoing code</p>
    <h3 className='font-bold text-lg'>{code}</h3>
  </div>
);
