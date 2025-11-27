
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { type WithId } from '@/firebase/firestore/use-collection';
import { type CommunityPost } from '@/app/community/page';
import { formatDistanceToNow } from 'date-fns';
import { CommentSection } from './comment-section';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

type CommunityPostWithId = WithId<CommunityPost>;

interface CommunityPostCardProps {
    post: CommunityPostWithId;
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isLiking, setIsLiking] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const hasLiked = user ? post.likedBy?.includes(user.uid) : false;

    const handleLike = async () => {
        if (!user || !firestore || isLiking) return;

        setIsLiking(true);
        const postRef = doc(firestore, 'communityPosts', post.id);

        try {
            if (hasLiked) {
                await updateDoc(postRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(postRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error("Error liking post:", error);
        } finally {
            setIsLiking(false);
        }
    };

    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    }
    
    const postDate = post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : "just now";

    return (
        <Card>
            <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src={post.authorAvatar} />
                            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="font-headline text-lg">{post.title}</CardTitle>
                            <CardDescription>
                                Posted by {post.authorName} &bull; {postDate}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 mb-4 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            disabled={!user || isLiking}
                            className={cn(
                                "flex items-center gap-1 hover:text-primary px-1",
                                hasLiked && "text-primary"
                            )}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likes || 0}</span>
                        </Button>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary px-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.commentCount || 0} Comments</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </CardContent>

                <CollapsibleContent>
                    <div className="border-t pt-4">
                      <CommentSection postId={post.id} />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
