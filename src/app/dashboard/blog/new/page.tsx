
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  content: z.string().min(50, 'Content must be at least 50 characters.'),
  imageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
});

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      imageUrl: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create a post.' });
        return;
    }

    startTransition(async () => {
        try {
            const postsCollectionRef = collection(firestore, 'blogPosts');
            await addDoc(postsCollectionRef, {
                ...values,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                createdAt: serverTimestamp(),
            });

            toast({ title: 'Success!', description: 'Your blog post has been published.' });
            router.push('/dashboard/blog');

        } catch (error) {
            console.error('Error creating post:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'There was a problem creating your post.' });
        }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="-ml-3">
                        <Link href="/dashboard/blog">
                            <ArrowLeft className="mr-2" />
                            Back to Posts
                        </Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Publishing...' : 'Publish Post'}
                    </Button>
                </div>
                
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    placeholder="A catchy title for your article" 
                                    {...field} 
                                    className="border-none text-3xl md:text-4xl font-extrabold font-headline h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
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
                            <FormControl>
                                <Textarea
                                    className="border-none min-h-[400px] p-0 text-lg resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Write your heart out..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Header Image URL (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    </div>
  );
}
