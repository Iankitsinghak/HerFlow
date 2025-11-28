
'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Send, MessageSquare, Trash2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface Comment {
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt: any;
    parentId?: string | null;
}
type CommentWithId = WithId<Comment>;

interface CommentSectionProps {
    postId: string;
}

const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

function CommentForm({ postId, parentId = null, onCommentPosted }: { postId: string, parentId?: string | null, onCommentPosted: () => void }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !firestore || !comment.trim()) return;

        setIsSubmitting(true);
        try {
            const commentsCollectionRef = collection(firestore, `communityPosts/${postId}/comments`);
            const postRef = doc(firestore, 'communityPosts', postId);

            await addDoc(commentsCollectionRef, {
                postId: postId,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                authorAvatar: user.photoURL || null,
                content: comment.trim(),
                createdAt: serverTimestamp(),
                parentId: parentId,
            });

            await updateDoc(postRef, {
                commentCount: increment(1)
            });

            setComment('');
            onCommentPosted();
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!user) return null;

    return (
        <form onSubmit={handleSubmitComment} className="flex items-start gap-3 w-full">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback>{getInitials(user.displayName || '')}</AvatarFallback>
            </Avatar>
            <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
                rows={1}
                disabled={isSubmitting}
            />
            <Button type="submit" size="icon" disabled={!comment.trim() || isSubmitting}>
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
}

function CommentItem({ comment, postId, replies, onCommentDeleted }: { comment: CommentWithId, postId: string, replies: CommentWithId[], onCommentDeleted: () => void }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isAuthor = user?.uid === comment.authorId;

    const handleDelete = async () => {
        if (!firestore || !isAuthor) return;
        setIsDeleting(true);

        const commentRef = doc(firestore, `communityPosts/${postId}/comments`, comment.id);
        const postRef = doc(firestore, 'communityPosts', postId);

        try {
            await deleteDoc(commentRef);
            await updateDoc(postRef, {
                commentCount: increment(-1)
            });
            toast({ title: "Comment Deleted" });
            onCommentDeleted();
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not delete comment." });
        } finally {
            setIsDeleting(false);
        }
    }


    return (
        <div className="flex items-start gap-3 group">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatar} />
                <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{comment.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                        {comment.createdAt?.toDate ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                    </p>
                </div>
                <p className="text-sm text-foreground/90 mt-1">{comment.content}</p>
                <div className="mt-1 flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs h-auto px-1 py-0.5" onClick={() => setShowReplyForm(!showReplyForm)}>
                        Reply
                    </Button>
                     {isAuthor && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-xs h-auto px-1 py-0.5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete your comment.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                {showReplyForm && (
                     <div className="mt-2">
                        <CommentForm postId={postId} parentId={comment.id} onCommentPosted={() => setShowReplyForm(false)} />
                    </div>
                )}
                
                {replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-6 border-l">
                        {replies.map(reply => (
                            <CommentItem key={reply.id} comment={reply} postId={postId} replies={[]} onCommentDeleted={onCommentDeleted} /> 
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


export function CommentSection({ postId }: CommentSectionProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const [forceRerender, setForceRerender] = useState(0);
    
    const commentsCollectionRef = useMemoFirebase(
        () => (firestore ? collection(firestore, `communityPosts/${postId}/comments`) : null),
        [firestore, postId]
    );

    const commentsQuery = useMemoFirebase(
        () => (commentsCollectionRef ? query(commentsCollectionRef, orderBy('createdAt', 'asc')) : null),
        [commentsCollectionRef]
    );

    const { data: comments, isLoading } = useCollection<Comment>(commentsQuery, [forceRerender]);

    const { topLevelComments, repliesByParent } = useMemo(() => {
        if (!comments) return { topLevelComments: [], repliesByParent: {} };
        
        const topLevel: CommentWithId[] = [];
        const replies: Record<string, CommentWithId[]> = {};

        for (const comment of comments) {
            if (comment.parentId) {
                if (!replies[comment.parentId]) {
                    replies[comment.parentId] = [];
                }
                replies[comment.parentId].push(comment as CommentWithId);
            } else {
                topLevel.push(comment as CommentWithId);
            }
        }
        return { topLevelComments: topLevel, repliesByParent: replies };
    }, [comments]);


    return (
        <div className="px-6 pb-6 space-y-6">
            <div className="w-full">
                {user ? (
                    <CommentForm postId={postId} onCommentPosted={() => {}} />
                ) : (
                    <p className="text-sm text-muted-foreground text-center">
                        <Link href="/login" className="underline font-medium">Log in</Link> to join the conversation.
                    </p>
                )}
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </>
                ) : topLevelComments.length > 0 ? (
                    topLevelComments.map((c) => (
                       <CommentItem 
                            key={c.id} 
                            comment={c} 
                            postId={postId} 
                            replies={repliesByParent[c.id] || []} 
                            onCommentDeleted={() => setForceRerender(v => v + 1)}
                        />
                    ))
                ) : (
                    <div className="text-center py-10">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-2 text-lg font-medium">No comments yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
