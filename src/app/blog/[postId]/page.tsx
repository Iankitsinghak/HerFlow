'use client';

import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import Header from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Image from 'next/image';

interface BlogPost {
    title: string;
    content: string;
    authorName: string;
    authorId: string;
    createdAt: Timestamp;
    imageUrl?: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const postId = params.postId as string;
    const firestore = useFirestore();

    const postRef = useMemoFirebase(
        () => (firestore && postId ? doc(firestore, `blogPosts/${postId}`) : null),
        [firestore, postId]
    );

    const { data: post, isLoading } = useDoc<BlogPost>(postRef);

    const formatDate = (timestamp: Timestamp | null | undefined) => {
        if (!timestamp) return 'No date';
        return format(timestamp.toDate(), 'MMMM dd, yyyy');
    };

    const getInitials = (name?: string | null) => {
        return name ? name.split(' ').map(n => n[0]).join('') : 'A';
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-8" />
                    <Skeleton className="w-full aspect-[16/9] rounded-lg mb-8" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (!post) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                        <h1 className="text-4xl font-bold font-headline">Post not found</h1>
                        <p className="text-muted-foreground mt-2">The article you're looking for doesn't exist or may have been moved.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <article className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
                <header className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold font-headline leading-tight mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <Avatar>
                            <AvatarImage />
                            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-foreground">{post.authorName}</p>
                            <p className="text-sm">Published on {formatDate(post.createdAt)}</p>
                        </div>
                    </div>
                </header>

                {post.imageUrl && (
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={1200}
                        height={675}
                        className="w-full aspect-[16/9] object-cover rounded-lg mb-8 shadow-lg"
                        priority
                    />
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-foreground/90 whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>
        </div>
    )
}
