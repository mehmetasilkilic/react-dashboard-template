import { useState } from "react";
import { SteppedModal } from "@/components/app/Modal";
import { z } from "zod";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (data: any) => {
    console.log("Saving...", data);
    setIsModalOpen(false);
  };

  const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const additionalInfoSchema = z.object({
    name: z.string().min(2),
    age: z.number().min(18),
  });

  const steps = [
    {
      title: "Sign In",
      content: {
        form: {
          schema: signInSchema,
          onSubmit: (data: z.infer<typeof signInSchema>) =>
            console.log("Sign in data:", data),
          fieldConfig: {
            email: {
              inputProps: {
                placeholder: "Type Your E-mail Address",
              },
            },
            password: {
              inputProps: {
                type: "password",
                placeholder: "Enter your password",
              },
            },
          },
        },
      },
    },
    {
      title: "Terms and Conditions",
      content: {
        content: (
          <div>
            <h3>Terms and Conditions</h3>
            <p>Please read and accept our terms and conditions...</p>
            <input type="checkbox" id="accept" name="accept" />
            <label htmlFor="accept">I accept the terms and conditions</label>
          </div>
        ),
      },
    },
    {
      title: "Additional Info",
      content: {
        form: {
          schema: additionalInfoSchema,
          onSubmit: (data: z.infer<typeof additionalInfoSchema>) =>
            console.log("Additional info:", data),
        },
      },
    },
  ];

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <SteppedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Registration"
        description="Complete the steps below to register a new user"
        steps={steps}
        onSave={handleSave}
      />
    </div>
  );
};

export default Dashboard;
