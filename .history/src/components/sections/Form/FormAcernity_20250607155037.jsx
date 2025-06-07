"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "@chakra-ui/react";

import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

const formFields = [
  { id: "firstname", label: "First name", placeholder: "Tyler", type: "text" },
  { id: "lastname", label: "Last name", placeholder: "Durden", type: "text" },
  { id: "email", label: "Email Address", placeholder: "projectmayhem@fc.com", type: "email" },
  { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
  { id: "twitterpassword", label: "Your twitter password", placeholder: "••••••••", type: "password" },
];

const FormAcernity = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(data.entries());
    console.log("Form submitted:", formValues);
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Aceternity
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to aceternity if you can because we don&apos;t have a login flow
        yet
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          {formFields.map((field) => (
            <LabelInputContainer key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
              />
            </LabelInputContainer>
          ))}
        </div>

        <button
          className="group/btn mt-8 relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <OAuthButton icon={<IconBrandGithub />} label="GitHub" />
          <OAuthButton icon={<IconBrandGoogle />} label="Google" />
          <OAuthButton icon={<IconBrandOnlyfans />} label="OnlyFans" />
        </div>
      </form>
    </div>
  );
}

export default FormAcernity;

