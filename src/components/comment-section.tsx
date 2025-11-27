
'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Send, MessageSquare } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

interface Comment {
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt: any;
}
type CommentWithId = WithId<Comment>;

interface CommentSectionProps {
    postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const commentsCollectionRef = useMemoFirebase(
        () => (firestore ? collection(firestore, `communityPosts/${postId}/comments`) : null),
        [firestore, postId]
    );

    const commentsQuery = useMemoFirebase(
        () => (commentsCollectionRef ? query(commentsCollectionRef, orderBy('createdAt', 'asc')) : null),
        [commentsCollectionRef]
    );

    const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !firestore || !comment.trim() || !commentsCollectionRef) return;

        setIsSubmitting(true);
        try {
            const postRef = doc(firestore, 'communityPosts', postId);

            // Add the new comment
            await addDoc(commentsCollectionRef, {
                postId: postId,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                authorAvatar: user.photoURL || null,
                content: comment.trim(),
                createdAt: serverTimestamp(),
            });
            
            // Increment the comment count on the post
            await updateDoc(postRef, {
                commentCount: increment(1)
            });

            setComment('');
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-6">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </>
                    ) : comments && comments.length > 0 ? (
                        comments.map((c) => (
                            <div key={c.id} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={c.authorAvatar} />
                                    <AvatarFallback>{getInitials(c.authorName)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">{c.authorName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {c.createdAt?.toDate ? formatDistanceToNow(c.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                                        </p>
                                    </div>
                                    <p className="text-sm text-foreground/90 mt-1">{c.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                             <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-2 text-lg font-medium">No comments yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            
            <div className="mt-auto pt-4 border-t">
                {user ? (
                    <form onSubmit={handleSubmitComment} className="flex items-start gap-3">
                        <Avatar className="h-9 w-9 mt-1">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback>{getInitials(user.displayName || '')}</AvatarFallback>
                        </Avatar>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 min-h-[40px] max-h-28"
                            rows={1}
                            disabled={isSubmitting}
                        />
                        <Button type="submit" size="icon" disabled={!comment.trim() || isSubmitting}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                ) : (
                    <p className="text-sm text-muted-foreground text-center">
                        <a href="/login" className="underline font-medium">Log in</a> to join the conversation.
                    </p>
                )}
            </div>
        </div>
    );
}
