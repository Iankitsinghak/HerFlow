import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const mockPosts = [
    { id: 1, title: "Understanding PCOS: A Comprehensive Guide", author: "Dr. Jane Doe", date: "April 25, 2024", excerpt: "Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder among women of reproductive age. This guide covers symptoms, causes, and management strategies.", image: "https://picsum.photos/seed/blog1/400/225", imageHint: "health infographic" },
    { id: 2, title: "The Importance of Pelvic Floor Health", author: "Emily White, PT", date: "April 22, 2024", excerpt: "Your pelvic floor is crucial for core stability and organ support. Learn exercises and tips to maintain its strength and function.", image: "https://picsum.photos/seed/blog2/400/225", imageHint: "woman exercising" },
    { id: 3, title: "Navigating Perimenopause: What to Expect", author: "Dr. Susan Black", date: "April 18, 2024", excerpt: "Perimenopause can bring a range of changes. We break down what's happening to your body and how to manage the transition smoothly.", image: "https://picsum.photos/seed/blog3/400/225", imageHint: "thoughtful woman" },
]

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Woomania Blog</h1>
                    <p className="text-lg text-muted-foreground mt-2">Insights and stories on women's health.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {mockPosts.map(post => (
                        <Link href={`/blog/${post.id}`} key={post.id} className="group">
                             <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                                <CardHeader className="p-0">
                                    <Image src={post.image} alt={post.title} width={400} height={225} className="w-full object-cover aspect-video" data-ai-hint={post.imageHint} />
                                </CardHeader>
                                <CardContent className="p-6">
                                    <CardTitle className="font-headline text-xl mb-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground mb-4">{post.author} &middot; {post.date}</CardDescription>
                                    <p className="text-foreground/80 text-base">{post.excerpt}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
