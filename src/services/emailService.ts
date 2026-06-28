export const sendWelcomeEmail = async (email: string, name: string, role: string) => {
  const isSeeker = role === 'seeker';

  const subject = isSeeker 
    ? "You're in. Welcome to the future of your career." 
    : "Welcome to the NextInCampus Inner Circle";

  // Using a clean, center-aligned, modern font stack
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">Hi ${name},</h1>
      
      <p style="font-size: 16px; margin-bottom: 20px;">
        ${isSeeker 
          ? "Welcome to <b>NextInCampus</b>. You’ve taken a decisive step away from the 'resume black hole' and into a network designed for those who refuse to leave their career to chance." 
          : "Welcome to <b>NextInCampus</b>. Your expertise is the most valuable asset in our ecosystem, and we are honored to have you as a verified insider."}
      </p>

      <p style="font-size: 16px; margin-bottom: 30px;">
        ${isSeeker 
          ? "We built this platform for the ambitious—for students who have the talent and drive, but haven't yet been given the right spotlight." 
          : "By joining us, you are helping fix a broken hiring culture. You’ll now receive curated requests from candidates who have passed our platform's intent-filter."}
      </p>

      <div style="margin-top: 40px;">
        <a href="https://nextincampus.in/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600;">
          ${isSeeker ? "Access Your Dashboard" : "View Your Mentorship Inbox"}
        </a>
      </div>

      <p style="margin-top: 40px; font-size: 14px; color: #888;">
        Best,<br>
        The NextInCampus Team
      </p>
      
      <p style="font-size: 12px; color: #aaa; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
        P.S. NextInCampus was built to solve a problem I faced personally. If you have feedback, just hit 'reply'—I read every single one.
      </p>
    </div>
  `;

  // Send using Resend...
  console.log('Sending email to:', email);
  console.log('Subject:', subject);
  // Uncomment below when Resend is set up
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'founder@nextincampus.in',
    to: email,
    subject: subject,
    html: htmlContent
  });
  */
  
  return { success: true, htmlContent };
};
