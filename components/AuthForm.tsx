"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import  Link  from "next/link";
import OtpModal from "@/components/OTPModal";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};
 
const AuthForm = ({type}: {type: FormType}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit=async(values: z.infer<typeof formSchema>)=> {
    setIsLoading(true);
    setErrorMessage("");

     try{
      const user=
        type === "sign-up"
        ? await CreateAccount ({
              fullName: values.fullName || "",
              email: values.email,
          })
       : await SignInUser({
            email: values.email,
       });
      setAccountId(user.accountId);
     }catch{
      setErrorMessage("Impossible de creer un compte.S'il vous plait essayer de nouveau.");
     }finally{
      setIsLoading(false);
     }
  };
  return (
        <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign in" : "Sign up"}
          </h1>
          {type=== "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez votre nom" className="shad-input" {...field} />
                  </FormControl>
                  </div>
                  <FormMessage  className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>
                <FormControl>
                    <Input
                      placeholder="Entre votre email"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage  className="shad-form-message"  />
              </FormItem>
            )}
          />
          <Button 
          type="submit"
          className="form-submit-button"
          disabled={isLoading}
          >
            {type === "sign-in" ? "Se connecter" : "S'inscrire"}
            {isLoading && (
              <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              width={24}
              height={24}
              className="ml-2 animate-spin"
              />
            )}
          </Button>
          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
              ? "Vous n'avez pas de compte ?"
              : "Vous avez déjà un compte ?"}
            </p>
            <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="ml-1 font-medium text-brand"
            >
              {""}
              {type === "sign-in" ? "S'inscrire" : "Se connecter"}
            </Link>
            </div>
        </form>
      </Form>
      {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};  

export default AuthForm;