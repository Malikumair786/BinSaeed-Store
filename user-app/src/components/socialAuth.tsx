import React from "react";
import Image from "next/image";

import GoogleIcon from "../icons/google.png";
import FacebookIcon from "../icons/facebook.png";

const SocialAuthButtons = () => {
  const handleLoginWithGoogle = () => {
    try {
      const googleAuthUrl = `${process.env.NEXT_PUBLIC_APP_API_URL}/auth/google`;
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.log("Google login error:", error);
    }
  };

  const handleLoginWithFacebook = () => {
    try {
      const facebookAuthUrl = `${process.env.NEXT_PUBLIC_APP_API_URL}/auth/facebook`;
      window.location.href = facebookAuthUrl;
    } catch (error) {
      console.log("Facebook login error:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center space-x-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="text-foreground text-lg">or continue with</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>
      <div className="flex justify-center space-x-4">
        <div
          className="flex items-center justify-center w-12 h-12 border-2 border-gray-300 rounded-full overflow-hidden p-0.5 cursor-pointer"
          onClick={handleLoginWithGoogle}
        >
          <Image
            priority
            src={GoogleIcon}
            alt="Google"
            width={64}
            height={64}
            className="w-16 h-full object-cover"
          />
        </div>
        <div
          className="flex items-center justify-center w-12 h-12 border-2 border-gray-300 rounded-full overflow-hidden p-0 cursor-pointer"
          onClick={handleLoginWithFacebook}
        >
          <Image
            priority
            src={FacebookIcon}
            alt="Facebook"
            width={64}
            height={64}
            className="w-16 h-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default SocialAuthButtons;
