import { useState } from "react";
import { SteppedModal } from "@/components/app/SteppedModal";
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
    ages: z.number().min(18),
    agess: z.number().min(18),
    agesss: z.number().min(18),
  });

  const steps = [
    {
      title: "Sign In",
      content: {
        form: {
          schema: signInSchema,
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
