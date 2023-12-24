import { common_type } from "../types";
import dotenvconfig from "../config/dotenvconfig";

interface IEmailTemplate {
  receiver_name: string;
  receiver_email: string;
  access_token: string;
}

interface IRegisterAccountEmailTemplate extends IEmailTemplate {
  account: "user" | "staff";
}

export const registerAccountEmailTemplate = ({
  account,
  receiver_email,
  receiver_name,
  access_token,
}: IRegisterAccountEmailTemplate): common_type.IEmailBody => {
  return account === "staff"
    ? {
        from: dotenvconfig.EMAIL_USER_NAME,
        to: receiver_email,
        subject: "Register account",
        html: `<h2>Hello ${receiver_name}</h2>
        <p>
          Please click the following 'Register account' button to verify your email and complete registartion.
        </p>

        <a href="${dotenvconfig.DASHBOARD_URL}/verify-email?token=${access_token}" style="color: #fff; background-color: #010101; font-size: 1rem; font-weight: 500; text-decoration: none; padding: 0.5rem 1rem; border: none; outline: none; border-radius: 0.15rem; margin: 0.75rem 0">
          Register account
        </a>

        <p>
          This link will expire in <strong>15 minutes</strong>
        </p>

        <p style="margin: 1rem 0 0 0">
          If you did not initiate this request, please contact us immediately at ${dotenvconfig.EMAIL_USER}
        </p>

        <p style="margin: 0.5rem 0">
          Note: Your account will be deleted even after registration if our CEO don't want you to become one of our staff. 
        </p>

        <p style="margin: 0.75rem 0">
          Thank you
        </p>

        <strong>
          EasyCart Team
        </strong>
      `,
      }
    : {
        from: dotenvconfig.EMAIL_USER_NAME,
        to: receiver_email,
        subject: "Register account",
        html: `<h2>Hello ${receiver_name}</h2>
        <p>
          Please click the following 'Register account' button to verify your email and complete registartion.
        </p>

        <a href="${dotenvconfig.SITE_URL}/verify-email?token=${access_token}" style="color: #fff; background-color: #010101; font-size: 1rem; font-weight: 500; text-decoration: none; padding: 0.5rem 1rem; border: none; outline: none; border-radius: 0.15rem; margin: 0.75rem 0">
          Register account
        </a>

        <p>
          This link will expire in <strong>15 minutes</strong>
        </p>

        <p style="margin: 1rem 0 0 0">
          If you did not initiate this request, please contact us immediately at ${dotenvconfig.EMAIL_USER}
        </p>

        <p style="margin: 0.75rem 0>
          Thank you
        </p>

        <strong>
          EasyCart Team
        </strong>
      `,
      };
};

export const resetAccountPasswordEmailTemplate = ({
  receiver_email,
  receiver_name,
  access_token,
}: IEmailTemplate): common_type.IEmailBody => {
  return {
    from: dotenvconfig.EMAIL_USER_NAME,
    to: receiver_email,
    subject: "Reset Your Password",
    html: `<h2>Hello ${receiver_name}</h2>
      <p>
        Please click the following "Reset Password" button to reset your password.
      </p>


      <a href="${dotenvconfig.SITE_URL}/reset-password?token=${access_token}" style="color: #fff; background-color: #010101; font-size: 1rem; font-weight: 500; text-decoration: none; padding: 0.5rem 1rem; border: none; outline: none; border-radius: 0.15rem; margin: 0.75rem 0">
        Reset Password
      </a>

      <p>
        This link will expire in <strong>15 minutes</strong>
      </p>

      <p style="margin: 1rem 0 0 0">
        If you did not initiate this request, please contact us immediately at ${dotenvconfig.EMAIL_USER}
      </p>

      <p style="margin: 0.75rem 0>
        Thank you
      </p>

      <strong>
        Easy Cart Team
      </strong>
        `,
  };
};

export const emailToSuperAdminTemplate = ({
  guest_name,
  guest_email,
}: {
  guest_name: string;
  guest_email: string;
}): common_type.IEmailBody => {
  return {
    from: dotenvconfig.EMAIL_USER_NAME,
    to: dotenvconfig.SUPER_ADMIN,
    subject: "Review Account",
    html: `<p>
        Someone with name ${guest_name} and email ${guest_email} wants to become an staff. Please review this account and take appropriate action.
      </p>
      `,
  };
};

export const updateAccountEmailTemplate = ({
  receiver_email,
  receiver_name,
  access_token,
  account,
}: IRegisterAccountEmailTemplate): common_type.IEmailBody => {
  const link: string =
    account === "staff" ? dotenvconfig.DASHBOARD_URL : dotenvconfig.SITE_URL;

  return {
    from: dotenvconfig.EMAIL_USER_NAME,
    to: receiver_email,
    subject: "Update Account Email",
    html: `<h2>Hello ${receiver_name}</h2>
        <p>
          Please click the following 'Update Email' button to verify and update your email.
        </p>

        <a href="${link}/verify-account-email?token=${access_token}" style="color: #fff; background-color: #010101; font-size: 1rem; font-weight: 500; text-decoration: none; padding: 0.5rem 1rem; border: none; outline: none; border-radius: 0.15rem; margin: 0.75rem 0">
          Update Email
        </a>

        <p>
          This link will expire in <strong>15 minutes</strong>
        </p>

        <p style="margin: 1rem 0 0 0">
          If you did not initiate this request, please contact us immediately at ${dotenvconfig.EMAIL_USER}
        </p>

        <p style="margin: 0.75rem 0>
          Thank you
        </p>

        <strong>
          EasyCart Team
        </strong>
      `,
  };
};
