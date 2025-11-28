
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, UserCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc, FirestoreError } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { type WithId } from '@/firebase/firestore/use-collection';
import { type CommunityPost } from '@/app/community/page';
import { formatDistanceToNow } from 'date-fns';
import { CommentSection } from './comment-section';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';


type CommunityPostWithId = WithId<CommunityPost>;

interface CommunityPostCardProps {
    post: CommunityPostWithId;
}

export function CommunityPostCard({ post: initialPost }: CommunityPostCardProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    // Use local state for optimistic updates
    const [post, setPost] = useState(initialPost);
    const [isLiking, setIsLiking] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // This effect ensures the local state is updated if the parent's data changes
    useEffect(() => {
        setPost(initialPost);
    }, [initialPost]);


    const hasLiked = user ? post.likedBy?.includes(user.uid) : false;
    const isAuthor = user ? user.uid === post.authorId : false;

    const handleLike = () => {
        if (!user || !firestore || isLiking) return;

        setIsLiking(true);

        const newLikedState = !hasLiked;
        
        // Corrected logic for optimistic update
        const currentLikeCount = post.likes || 0;
        const newLikeCount = newLikedState ? currentLikeCount + 1 : currentLikeCount - 1;

        const newLikedBy = newLikedState
            ? [...(post.likedBy || []), user.uid]
            : (post.likedBy || []).filter(id => id !== user.uid);

        setPost({
            ...post,
            likes: newLikeCount,
            likedBy: newLikedBy,
        });

        const postRef = doc(firestore, 'communityPosts', post.id);
        const updateData = {
            likes: increment(newLikedState ? 1 : -1),
            likedBy: newLikedState ? arrayUnion(user.uid) : arrayRemove(user.uid)
        };

        updateDoc(postRef, updateData)
            .catch((serverError: FirestoreError) => {
                // Revert optimistic update on error
                setPost(initialPost); 
                
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'update',
                    requestResourceData: updateData,
                });
                errorEmitter.emit('permission-error', permissionError);

                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not update like. Please check permissions.',
                });
            })
            .finally(() => {
                setIsLiking(false);
            });
    };

    const handleDelete = async () => {
        if (!isAuthor || !firestore) return;
        
        setIsDeleting(true);
        const postRef = doc(firestore, 'communityPosts', post.id);

        deleteDoc(postRef)
            .then(() => {
                 toast({
                    title: 'Post Deleted',
                    description: 'Your post has been successfully removed.',
                });
            })
            .catch((serverError: FirestoreError) => {
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'delete',
                });
                errorEmitter.emit('permission-error', permissionError);

                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'You do not have permission to delete this post.',
                });
            })
            .finally(() => {
                setIsDeleting(false);
                setIsDeleteDialogOpen(false);
            });
    }

    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    }
    
    const postDate = post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : "just now";

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-primary/10 bg-white/50 dark:bg-card/50 backdrop-blur-lg rounded-2xl overflow-hidden">
            <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src={post.isAnonymous ? undefined : post.authorAvatar || undefined} />
                            <AvatarFallback className="bg-secondary">
                                {post.isAnonymous ? <UserCircle/> : getInitials(post.authorName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="font-headline text-lg">{post.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 text-xs">
                                <span>Posted by {post.isAnonymous ? 'Anonymous' : post.authorName} &bull; {postDate}</span>
                            </CardDescription>
                        </div>
                        {isAuthor && (
                             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your post and any comments associated with it.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 mb-6 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            disabled={!user || isLiking}
                            className={cn(
                                "flex items-center gap-1 hover:text-primary px-1 h-auto py-1",
                                hasLiked && "text-primary"
                            )}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likes || 0}</span>
                        </Button>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary px-1 h-auto py-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.commentCount || 0} Comments</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </CardContent>

                <CollapsibleContent>
                    <div className="border-t pt-4 bg-muted/30">
                      <CommentSection postId={post.id} />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
