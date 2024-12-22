import { z } from "zod";
import { FormBuilder } from "@/components/app/FormBuilder";
import type { FormField, FormSchema } from "@/components/app/FormBuilder/types";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().min(18),
  role: z.string(),
  skills: z.array(z.string()).min(1),
  bio: z.string().optional(),
  notifications: z.boolean(),
  terms: z.boolean(),
}) satisfies FormSchema;

type UserFormSchema = typeof schema;

// Define your form fields with validation
const userFormFields: FormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    required: true,
    description: "We will never share your email",
    validation: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
  },
  {
    name: "password",
    type: "text",
    label: "Password",
    placeholder: "Enter your password",
    required: true,
    validation: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  },
  {
    name: "age",
    type: "number",
    label: "Age",
    required: true,
    description: "You must be 18 or older",
    validation: z
      .number()
      .min(18, "Must be at least 18 years old")
      .max(100, "Invalid age"),
  },
  {
    name: "role",
    type: "select",
    label: "Role",
    placeholder: "Select your role",
    required: true,
    options: [
      { label: "Developer", value: "developer" },
      { label: "Designer", value: "designer" },
      { label: "Product Manager", value: "pm" },
      { label: "Team Lead", value: "lead" },
    ],
    validation: z.string().min(1, "Please select a role"),
  },
  {
    name: "skills",
    type: "multiselect",
    label: "Skills",
    placeholder: "Select your skills",
    description: "Choose all that apply",
    options: [
      { label: "React", value: "react" },
      { label: "TypeScript", value: "typescript" },
      { label: "Node.js", value: "nodejs" },
      { label: "Python", value: "python" },
      { label: "Java", value: "java" },
      { label: "UI/UX Design", value: "design" },
      { label: "Agile", value: "agile" },
    ],
    validation: z
      .array(z.string())
      .min(1, "Select at least one skill")
      .max(5, "You can select up to 5 skills"),
  },
  {
    name: "bio",
    type: "textarea",
    label: "Bio",
    placeholder: "Tell us about yourself",
    description: "Keep it under 500 characters",
    validation: z
      .string()
      .max(500, "Bio must not exceed 500 characters")
      .optional(),
  },
  {
    name: "notifications",
    type: "switch",
    label: "Email Notifications",
    description: "Receive updates about new features",
    validation: z.boolean(),
  },
  {
    name: "terms",
    type: "checkbox",
    label: "I agree to the Terms and Conditions",
    required: true,
    validation: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms"),
  },
];

const Dashboard = () => {
  const handleSubmit = async (data: z.infer<UserFormSchema>) => {
    console.log("Form data:", data);
  };

  return (
    <div className="container mx-auto py-10">
      <FormBuilder<UserFormSchema>
        fields={userFormFields}
        onSubmit={handleSubmit}
        title="Create Account"
        description="Fill out the form below to create your account"
      />
    </div>
  );
};

export default Dashboard;
