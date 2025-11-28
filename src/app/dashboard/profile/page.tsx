
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useLanguage } from '@/context/language-provider';

const formSchema = z.object({
  displayName: z.string().min(1, 'Display name is required.'),
  bio: z.string().max(160, 'Bio cannot be longer than 160 characters.'),
  language: z.string(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { language, setLanguage, languages } = useLanguage();

  const userProfileRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, `users/${user.uid}/userProfiles`, user.uid) : null),
    [user, firestore]
  );

  const { data: userProfile, isLoading } = useDoc<any>(userProfileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      language: language,
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName || user?.displayName || '',
        bio: userProfile.bio || '',
        language: userProfile.language || language,
      });
      if (userProfile.language) {
        setLanguage(userProfile.language);
      }
    } else {
        form.reset({
            displayName: user?.displayName || '',
            bio: '',
            language: language
        })
    }
  }, [userProfile, user, form, language, setLanguage]);

  const onSubmit = (values: ProfileFormValues) => {
    if (!userProfileRef) return;

    startTransition(async () => {
      try {
        await setDoc(userProfileRef, values, { merge: true });
        setLanguage(values.language);
        toast({
          title: 'Success!',
          description: 'Your profile has been updated.',
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem updating your profile.',
        });
      }
    });
  };

  const getInitials = (name?: string | null) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (isLoading) {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Profile</h1>
                <p className="text-muted-foreground">
                Loading your information...
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        This information will be displayed publicly so be careful what you share.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
                        <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                    </div>
                     <div className="space-y-2">
                        <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
                        <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
                         <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
                            <div className="h-10 w-full max-w-xs rounded-md bg-muted animate-pulse" />
                        </div>
                    </div>
                </CardContent>
             </Card>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
        <p className="text-muted-foreground">
          Update your personal information and preferences.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                This information will be displayed publicly so be careful what you share.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little about yourself" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Email Address</FormLabel>
                <Input type="email" value={user?.email || ''} disabled />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed.
                </p>
              </div>
               <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map(lang => (
                             <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormLabel>Profile Picture</FormLabel>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback>
                      {getInitials(userProfile?.displayName || user?.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <Input id="picture" type="file" className="max-w-xs" disabled />
                   <p className="text-xs text-muted-foreground">
                    Feature coming soon.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardContent>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
