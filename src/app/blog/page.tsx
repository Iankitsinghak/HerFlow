
'use client';

import Header from "@/components/layout/header";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, Timestamp } from "firebase/firestore";
import { useCollection, WithId } from "@/firebase/firestore/use-collection";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface BlogPost {
    title: string;
    authorName: string;
    authorId: string;
    createdAt: Timestamp;
    content: string;
    imageUrl?: string;
}

type BlogPostWithId = WithId<BlogPost>;

export default function BlogPage() {
    const firestore = useFirestore();

    const postsQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'blogPosts')) : null),
        [firestore]
    );

    const { data: posts, isLoading } = useCollection<BlogPost>(postsQuery);

    const formatDate = (timestamp: Timestamp | null | undefined) => {
        if (!timestamp) return 'No date';
        return format(timestamp.toDate(), 'MMMM dd, yyyy');
    }

    const getExcerpt = (content: string, length = 120) => {
        if (!content) return '';
        if (content.length <= length) return content;
        return content.substring(0, length).trim() + '...';
    }

    const getInitials = (name?: string | null) => {
        return name ? name.split(' ').map(n => n[0]).join('') : 'A';
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline">Woomania Blog</h1>
                        <p className="text-lg text-muted-foreground mt-2">Insights and stories on women's health.</p>
                    </div>
                     <Button asChild size="lg">
                        <Link href="/dashboard/blog/new">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Write a Story
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="max-w-3xl mx-auto space-y-12">
                        {[...Array(3)].map((_, i) => (
                             <div key={i} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ))}
                    </div>
                ) : !posts || posts.length === 0 ? (
                    <div className="text-center py-20 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-headline">The story is yet to be written.</h2>
                        <p className="text-muted-foreground mt-2 mb-6">Be the first one to share your voice, experience, or knowledge with the community. Your story matters.</p>
                        <Button asChild size="lg">
                           <Link href="/dashboard/blog/new">
                                Write the first post
                           </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-12 divide-y divide-border">
                        {posts.map((post: BlogPostWithId, index) => (
                            <Link href={`/blog/${post.id}`} key={post.id} className="group block pt-12 first:pt-0">
                               <article className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage />
                                            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-foreground">{post.authorName}</span>
                                        <span>&middot;</span>
                                        <span>{formatDate(post.createdAt)}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold font-headline leading-tight group-hover:text-primary transition-colors">{post.title}</h2>
                                    <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                                        <p className="text-foreground/80 text-base flex-1 leading-relaxed">
                                            {getExcerpt(post.content)}
                                        </p>
                                        {post.imageUrl && (
                                             <Image 
                                                src={post.imageUrl}
                                                alt={post.title} 
                                                width={150} 
                                                height={100} 
                                                className="w-full md:w-[150px] aspect-[4/3] object-cover rounded-md mt-4 md:mt-0" 
                                                data-ai-hint="blog post header"
                                            />
                                        )}
                                    </div>
                                    <div className="text-sm font-medium text-primary pt-2">Read more &rarr;</div>
                               </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
