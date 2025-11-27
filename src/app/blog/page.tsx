'use client';

import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, Timestamp } from "firebase/firestore";
import { useCollection, WithId } from "@/firebase/firestore/use-collection";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

interface BlogPost {
    title: string;
    authorName: string;
    createdAt: Timestamp;
    content: string;
    imageUrl?: string;
}

type BlogPostWithId = WithId<BlogPost>;

export default function BlogPage() {
    const firestore = useFirestore();

    const postsCollectionRef = useMemoFirebase(
        () => (firestore ? collection(firestore, 'blogPosts') : null),
        [firestore]
    );

    const postsQuery = useMemoFirebase(
        () => (postsCollectionRef ? query(postsCollectionRef, orderBy('createdAt', 'desc')) : null),
        [postsCollectionRef]
    );

    const { data: posts, isLoading } = useCollection<BlogPost>(postsQuery);

    const formatDate = (timestamp: Timestamp | null | undefined) => {
        if (!timestamp) return 'No date';
        return format(timestamp.toDate(), 'MMMM dd, yyyy');
    }

    const getExcerpt = (content: string, length = 150) => {
        if (!content) return '';
        if (content.length <= length) return content;
        return content.substring(0, length) + '...';
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Woomania Blog</h1>
                    <p className="text-lg text-muted-foreground mt-2">Insights and stories on women's health.</p>
                </div>

                {isLoading ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                             <Card key={i} className="h-full overflow-hidden">
                                <CardHeader className="p-0">
                                    <Skeleton className="w-full aspect-video" />
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-4" />
                                    <Skeleton className="h-16 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : !posts || posts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-headline">No posts yet!</h2>
                        <p className="text-muted-foreground mt-2">Check back soon for articles and stories from our community.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post: BlogPostWithId) => (
                            <Link href={`/blog/${post.id}`} key={post.id} className="group">
                                <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                                    <CardHeader className="p-0">
                                        <Image 
                                            src={post.imageUrl || "https://picsum.photos/seed/placeholder/400/225"} 
                                            alt={post.title} 
                                            width={400} 
                                            height={225} 
                                            className="w-full object-cover aspect-video" 
                                            data-ai-hint="blog post header"
                                        />
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <CardTitle className="font-headline text-xl mb-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground mb-4">{post.authorName} &middot; {formatDate(post.createdAt)}</CardDescription>
                                        <p className="text-foreground/80 text-base">{getExcerpt(post.content)}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
