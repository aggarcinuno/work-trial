"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SignupFormSchema } from "../form/signup-form-schema";
import { z } from "zod";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  console.log(data);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(values: z.infer<typeof SignupFormSchema>) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: values.email,
    password: values.password,
    name: values.name,
  };

  const { error } = await supabase.auth.signUp(data);
  const { data: userData } = await supabase.auth.getUser();
  console.log(userData?.user?.id);
  const { error: userError } = await supabase.from("users").insert({
    id: userData.user?.id,
    email: data.email,
    name: data.name,
  });
  if (error || userError) {
    console.log(userError);
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
