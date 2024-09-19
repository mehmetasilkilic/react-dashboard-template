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
        }}
      >
        <AutoFormSubmit>Sign In</AutoFormSubmit>
      </AutoForm>
    </div>
  );
};
