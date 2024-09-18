// Types
import { SignInParamProps } from "@/types";

// Local Components
import { SignInForm } from "./components";

const SignIn: React.FC = () => {
  const handleSignIn = (data: SignInParamProps) => {
    console.log("Form data:", data);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Sign In</h1>
      <SignInForm handleSignIn={handleSignIn} />
    </div>
  );
};

export default SignIn;
