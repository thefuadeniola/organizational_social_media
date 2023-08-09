'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { userValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "../ui/input";
import * as z from 'zod'
import Image from "next/image";

interface AccountProps {
    user: {
        id: any
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string
    };
    btnTitle: string
}
const AccountProfile = ({ user, btnTitle }: AccountProps) => {
    const form = useForm({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo: '',
            name: '',
            username: '',
            bio: ''
        }
    })
    function onSubmit(values: z.infer<typeof userValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10 text-light-1 space-y-8">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="account-form_image-label">
                                {field.value ? (
                                    <Image src={field.value} alt="profile photo" width={96} height={96} priority className="rounded-full object-contain" />
                                ) :
                                    (
                                        <Image src='/assets/profile.svg' alt="profile photo" width={24} height={24} className="object-contain" />
                                    )
                                }
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile