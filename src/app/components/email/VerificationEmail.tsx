import * as React from 'react';

interface EmailTemplateProps {
  firstName: string,
  code: string,
}

export const verificationEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  code,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Thanks for sign up. Here is you verifocation code</p>
    <h3 className='font-bold text-lg'>{code}</h3>
  </div>
);
