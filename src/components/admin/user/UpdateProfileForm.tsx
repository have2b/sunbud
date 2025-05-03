"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  ProfileFormValues,
  ProfileFormWithPasswordValues,
  profileFormSchema,
  profileFormWithPasswordSchema,
  validatePasswordMatch,
} from "@/validations/user.validation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface ProfileFormProps {
  user: ProfileFormValues;
  onSuccess: (updatedUser: ProfileFormWithPasswordValues) => void;
  onCancel: () => void;
}

export const ProfileForm = ({
  user,
  onSuccess,
  onCancel,
}: ProfileFormProps) => {
  const [changePassword, setChangePassword] = useState(false);
  
  // Use profile form schema with or without password based on checkbox state
  const form = useForm<ProfileFormWithPasswordValues>({
    resolver: valibotResolver(changePassword ? profileFormWithPasswordSchema : profileFormSchema),
    defaultValues: {
      ...user,
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: ProfileFormWithPasswordValues) => {
    // Validate password matching if changing password
    if (changePassword && values.password) {
      if (!validatePasswordMatch(values)) {
        form.setError("confirmPassword", { 
          message: "Passwords do not match"
        });
        return;
      }
    }
    
    // If not changing password, remove password fields from submission
    if (!changePassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, confirmPassword, ...userDataWithoutPassword } = values;
      onSuccess(userDataWithoutPassword as ProfileFormWithPasswordValues);
      return;
    }
    
    onSuccess(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage src={field.value} />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <FormControl>
                <Input {...field} placeholder="Avatar URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="changePassword" 
            checked={changePassword}
            onCheckedChange={(value) => setChangePassword(value === true)}
          />
          <label
            htmlFor="changePassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Change Password
          </label>
        </div>

        {changePassword && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
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
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};
