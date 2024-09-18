// Types
import { SignInParamProps } from "@/types";

// Form
import { SignInFormFields } from "@/forms";

// Global Components
import { FormBuilder } from "@/components";

interface SignInFormParams {
  handleSignIn: (data: SignInParamProps) => void;
}

export const SignInForm = ({ handleSignIn }: SignInFormParams) => {
  const handleSubmit = (data: SignInParamProps) => {
    handleSignIn(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <FormBuilder fields={SignInFormFields} onSubmit={handleSubmit} />
    </div>
  );
};
