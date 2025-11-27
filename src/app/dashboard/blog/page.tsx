'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { useCollection, WithId } from "@/firebase/firestore/use-collection";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  title: string;
  status: 'Published' | 'Draft';
  createdAt: Timestamp;
}

type BlogPostWithId = WithId<BlogPost>;

export default function BlogManagementPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const postsCollectionRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'blogPosts') : null),
    [firestore]
  );
  
  const userPostsQuery = useMemoFirebase(
    () => (postsCollectionRef && user ? query(
      postsCollectionRef,
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    ) : null),
    [postsCollectionRef, user]
  );

  const { data: posts, isLoading } = useCollection<BlogPost>(userPostsQuery);

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return 'No date';
    return format(timestamp.toDate(), 'MMMM dd, yyyy');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Blog Posts</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your articles.
          </p>
        </div>
        <Button asChild>
            <Link href="/dashboard/blog/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
            </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
          <CardDescription>A list of all your blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : !posts || posts.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You haven't written any posts yet.</p>
                    <Button variant="link" asChild>
                        <Link href="/dashboard/blog/new">Create your first post</Link>
                    </Button>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                            <Badge variant={post.status === "Published" ? "default" : "secondary"}>
                            {post.status || 'Published'}
                            </Badge>
                        </TableCell>
                        <TableCell>{formatDate(post.createdAt)}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" disabled>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
