
'use client';

import { useState } from "react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePostForm } from "@/components/create-post-form";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, where, Query } from "firebase/firestore";
import { useCollection, WithId } from "@/firebase/firestore/use-collection";
import { CommunityPostCard } from "@/components/community-post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityCategories } from "@/config/community";

export interface CommunityPost {
    id?: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    title: string;
    content: string;
    likes: number;
    likedBy: string[];
    commentCount: number;
    createdAt: any; // Allow server timestamp
    category: string;
    isAnonymous?: boolean;
}

type CommunityPostWithId = WithId<CommunityPost>;


export default function CommunityPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    
    const postsCollectionRef = useMemoFirebase(
        () => (firestore ? collection(firestore, 'communityPosts') : null),
        [firestore]
    );

    const postsQuery = useMemoFirebase(() => {
        if (!postsCollectionRef) return null;
        
        const queries: Query[] = [orderBy('createdAt', 'desc')];
        if (filterCategory !== 'all') {
            queries.unshift(where('category', '==', filterCategory));
        }

        return query(postsCollectionRef, ...queries);

    }, [postsCollectionRef, filterCategory]);

    const { data: posts, isLoading } = useCollection<CommunityPost>(postsQuery);

  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Community Forum</h1>
                    <p className="text-lg text-muted-foreground mt-2">Connect, share, and support each other.</p>
                </div>
                {user ? (
                    <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create a Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create a new post</DialogTitle>
                            </DialogHeader>
                            <CreatePostForm onPostCreated={() => setIsCreatePostOpen(false)} />
                        </DialogContent>
                    </Dialog>
                ) : (
                    <Button asChild>
                        <Link href="/login">Log in to post</Link>
                    </Button>
                )}
            </div>

            <div className="mb-6">
                <Tabs value={filterCategory} onValueChange={setFilterCategory}>
                    <TabsList className="flex flex-wrap h-auto">
                        <TabsTrigger value="all">All</TabsTrigger>
                        {communityCategories.map(cat => (
                             <TabsTrigger key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
            
            <div className="space-y-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </>
                ) : posts && posts.length > 0 ? (
                    posts.map(post => (
                        <CommunityPostCard key={post.id} post={post as CommunityPostWithId} />
                    ))
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold">No posts in this category yet</h3>
                        <p className="text-muted-foreground mt-2">Be the first one to share something! 💬</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}
