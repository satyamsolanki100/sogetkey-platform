import emailjs from "@emailjs/browser";

export const sendOTPEmail = async (userName, userEmail, otp) => {
  try {
    const response = await emailjs.send(
      "service_lsa5cag",
      "template_11hx4yo",
      {
        user_name: userName,
        email: userEmail,
        otp_code: otp,
      },
      "9uR4u735QODLLIAas",
    );

    return response;
  } catch (error) {
    throw error;
  }
};
