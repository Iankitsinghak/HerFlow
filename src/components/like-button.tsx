
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  postId: string;
  likeCount: number;
}

export function LikeButton({ postId, likeCount: initialLikeCount }: LikeButtonProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (!user || !firestore) return;

    const checkIfLiked = async () => {
      const likesRef = collection(firestore, `communityPosts/${postId}/likes`);
      const q = query(likesRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setIsLiked(!snapshot.empty);
    };

    checkIfLiked();
  }, [user, firestore, postId]);

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  const handleToggleLike = useCallback(async () => {
    if (!user || !firestore || isToggling) return;

    setIsToggling(true);
    const likesRef = collection(firestore, `communityPosts/${postId}/likes`);
    const q = query(likesRef, where('userId', '==', user.uid));

    try {
      const snapshot = await getDocs(q);
      const postRef = doc(firestore, 'communityPosts', postId);
      const batch = writeBatch(firestore);

      if (snapshot.empty) {
        const newLikeRef = doc(collection(firestore, `communityPosts/${postId}/likes`));
        batch.set(newLikeRef, {
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        batch.update(postRef, { likeCount: increment(1) });
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      } else {
        batch.delete(snapshot.docs[0].ref);
        batch.update(postRef, { likeCount: increment(-1) });
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      }

      await batch.commit();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsToggling(false);
    }
  }, [user, firestore, postId, isToggling]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleLike}
      disabled={!user || isToggling}
      className={cn(
        "flex items-center gap-1 px-1 h-auto py-1 hover:text-red-500 transition-colors",
        isLiked && "text-red-500"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          isLiked && "fill-current"
        )}
      />
      <span className="text-xs">{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
    </Button>
  );
}
