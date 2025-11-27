import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, PlusCircle } from "lucide-react";
import Link from "next/link";

const mockPosts = [
    { id: 1, author: "Sarah J.", avatar: "https://picsum.photos/seed/avatar1/40/40", title: "First time tracking my cycle, any tips?", content: "I've just started using Woomania to track my cycle and I'm a bit overwhelmed. Does anyone have advice on what to look out for or what's been most helpful for them?", likes: 12, comments: 5 },
    { id: 2, author: "Maria G.", avatar: "https://picsum.photos/seed/avatar2/40/40", title: "Looking for recommendations for managing period cramps.", content: "My cramps have been really bad lately. Heating pads help a little, but I'm looking for other natural remedies. What works for you all?", likes: 28, comments: 15 },
    { id: 3, author: "Chloe B.", avatar: "https://picsum.photos/seed/avatar3/40/40", title: "Success story with dietary changes for PCOS!", content: "Just wanted to share that after 3 months of a low-GI diet, my symptoms have improved so much! Happy to share what I've learned if anyone is interested.", likes: 55, comments: 22 },
]

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Community Forum</h1>
                    <p className="text-lg text-muted-foreground mt-2">Connect, share, and support each other.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/blog/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create a Post
                    </Link>
                </Button>
            </div>
            
            <div className="space-y-6">
                {mockPosts.map(post => (
                    <Card key={post.id}>
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src={post.avatar} />
                                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Link href="#" className="hover:underline">
                                        <CardTitle className="font-headline text-lg">{post.title}</CardTitle>
                                    </Link>
                                    <CardDescription>Posted by {post.author}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground/90 mb-4">{post.content}</p>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-primary">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>{post.likes} Likes</span>
                                </button>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{post.comments} Comments</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </div>
  )
}
