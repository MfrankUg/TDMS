
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/hooks/use-translation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  countryCode: z.string().min(1, { message: "Please select a country code." }),
  telephone: z.string().min(1, { message: "Telephone number is required." }),
  role: z.string().min(1, { message: "Please select a role." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
        {...props}
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    )
}

export function SignupForm() {
  const { signup } = useAuth();
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: "+256",
      telephone: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signup(values.email);
  }

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center items-center gap-2">
            <span className="text-3xl font-bold">TDMS</span>
        </div>
        <CardDescription>
          Safeguarding Coffee Quality with Smart Monitoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Telephone</FormLabel>
                <div className="flex gap-2">
                    <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                        <FormItem className="w-1/3">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="+256">🇺🇬 UG (+256)</SelectItem>
                                <SelectItem value="+254">🇰🇪 KE (+254)</SelectItem>
                                <SelectItem value="+255">🇹🇿 TZ (+255)</SelectItem>
                                <SelectItem value="+1">🇺🇸 US (+1)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                        <FormItem className="w-2/3">
                        <FormControl>
                            <Input type="tel" pattern="[0-9\s]+" placeholder="700 *** ***" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </FormItem>
             <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="warehouse-manager">Warehouse Manager</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Choose a strong password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>Your data is securely stored</span>
                </div>
                 <Link href="#" className="underline hover:text-primary">
                    Forgot password?
                 </Link>
            </div>
             <Button type="submit" className="w-full">
              Sign Up
            </Button>
             <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                </span>
                </div>
            </div>
            <Button variant="outline" className="w-full">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continue with Google
            </Button>
          </form>
        </Form>
       
        <div className="mt-4 text-center text-sm">
          {t('alreadyHaveAccount')}{" "}
          <Link href="/login" className="underline hover:text-primary">
            {t('login')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
