
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { DialogFooter } from './ui/dialog';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(100, 'Title is too long.'),
  content: z.string().min(10, 'Post content must be at least 10 characters.').max(2000, 'Post is too long.'),
  isAnonymous: z.boolean().default(false),
});

interface CreatePostFormProps {
    onPostCreated: () => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            isAnonymous: false,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to post.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const postsCollectionRef = collection(firestore, 'communityPosts');
            await addDoc(postsCollectionRef, {
                authorId: user.uid,
                authorName: values.isAnonymous ? 'Anonymous' : user.displayName || 'Anonymous',
                authorAvatar: values.isAnonymous ? null : user.photoURL || null,
                title: values.title,
                content: values.content,
                isAnonymous: values.isAnonymous,
                hugs: 0,
                huggedBy: [],
                commentCount: 0,
                createdAt: serverTimestamp(),
            });

            toast({ title: 'Success!', description: 'Your post has been published.' });
            form.reset();
            onPostCreated();

        } catch (error) {
            console.error("Error creating post:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not create post. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4 px-1">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Post Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="A catchy title for your post" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Share your thoughts with the community..." className="min-h-[120px]" {...field} />
                                </FormControl>
                                 <FormDescription>
                                    Your story can help others.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="isAnonymous"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg bg-muted/50 p-3 mt-6">
                                <div className="space-y-0.5">
                                    <FormLabel>Post Anonymously</FormLabel>
                                    <FormDescription className="text-xs">
                                        Your name and avatar will be hidden.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? 'Posting...' : 'Create Post'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
