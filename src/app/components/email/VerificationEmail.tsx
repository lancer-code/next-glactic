import * as React from 'react';

interface EmailTemplateProps {
  firstName: string,
  code: string,
}

export const verificationEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  code,
  email,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Thanks for sign up. Please Verfify your account {email} with the folwoing code</p>
    <h3 className='font-bold text-lg'>{code}</h3>
  </div>
);
