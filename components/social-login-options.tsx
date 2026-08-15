import GoogleIcon from "@/app/public/google-icon";
import { Button } from "./ui/button";
import GithubIcon from "@/app/public/github-icon";

const SocialLoginOptions = () => {
  return (
    <div className="mb-6 flex gap-3">
      <Button
        type="button"
        variant="secondary"
        className="h-11 flex-1 bg-[#f0f1f6]"
      >
        <GoogleIcon />
        Google
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="h-11 flex-1 bg-[#f0f1f6]"
      >
        <GithubIcon />
        GitHub
      </Button>
    </div>
  );
};

export default SocialLoginOptions;
