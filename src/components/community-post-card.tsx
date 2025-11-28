
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { useUser, useFirestore } from '@/firebase';
import { doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
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
    onPostDeleted: () => void;
}

export function CommunityPostCard({ post, onPostDeleted }: CommunityPostCardProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


    const isAuthor = user ? user.uid === post.authorId : false;

    const handleDelete = async () => {
        if (!isAuthor || !firestore) return;
        
        setIsDeleting(true);
        const postRef = doc(firestore, 'communityPosts', post.id);

        try {
            await deleteDoc(postRef);
            toast({
                title: 'Post Deleted',
                description: 'Your post has been successfully removed.',
            });
            onPostDeleted(); // Notify parent to refresh list
        } catch (error) {
             console.error('Error deleting post:', error);
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not delete post. You may not have permission.',
            });
        }
        finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    }

    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    }
    
    const postDate = post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : "just now";

    const handleCommentCountChange = (newCount: number) => {
        // This is a bit of a trick to update the UI without a full re-fetch
        // In a real app, you might re-fetch or use a more robust state management
        post.commentCount = newCount;
    }


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
                                            This action cannot be undone. This will permanently delete your post and all associated comments.
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
                      <CommentSection 
                        postId={post.id} 
                        onCommentCountChange={handleCommentCountChange} 
                      />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
