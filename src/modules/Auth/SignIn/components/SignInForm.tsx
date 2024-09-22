import { Link } from "react-router-dom";

// Types
import { SignInParamProps } from "@/types";

// Form
import { SignInFormFields } from "@/constants/forms";

// Global Components
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";

interface SignInFormParams {
  handleSignIn: (data: SignInParamProps) => void;
}

export const SignInForm = ({ handleSignIn }: SignInFormParams) => {
  const handleSubmit = (data: SignInParamProps) => {
    handleSignIn(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <AutoForm
        formSchema={SignInFormFields}
        onSubmit={handleSubmit}
        fieldConfig={{
          email: {
            inputProps: {
              placeholder: "Type Your E-mail Address",
            },
          },
          password: {
            inputProps: {
              type: "password",
              placeholder: "••••••••",
            },
          },
          rememberMe: {
            fieldType: "switch",
          },
        }}
      >
        <AutoFormSubmit>Sign In</AutoFormSubmit>
      </AutoForm>

      <div className="mt-4 text-sm text-center">
        <Link
          to="/auth/forgot-password"
          className="text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <div className="mt-2 text-sm text-center">
        Don't have an account?{" "}
        <Link to="/auth/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};
