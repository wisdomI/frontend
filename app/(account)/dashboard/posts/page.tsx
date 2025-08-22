import React from "react"
import Link from "next/link"

type Post = {
  id: string
  title: string
  date: string
  status: "draft" | "published" | "archived"
}

const mockPosts: Post[] = [
  { id: "1", title: "Summer Wedding Catering Ideas", date: "2025-07-12", status: "published" },
  { id: "2", title: "Top 10 Photographers in Lagos", date: "2025-06-21", status: "draft" },
  { id: "3", title: "How to Choose the Right DJ", date: "2025-05-30", status: "archived" },
]

export default function PostsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Posts</h1>
        <Link href="/dashboard/account/posts/new" className="inline-block bg-event-blue text-white px-4 py-2 rounded-md">
          New Post
        </Link>
      </div>

      <div className="space-y-4">
        {mockPosts.map((post) => (
          <article key={post.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div>
              <h2 className="text-lg font-medium">{post.title}</h2>
              <p className="text-sm text-gray-500">Published on {post.date}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  post.status === "published"
                    ? "bg-green-100 text-green-800"
                    : post.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {post.status}
              </span>

              <Link
                href={`/dashboard/account/posts/${post.id}/edit`}
                className="text-event-blue hover:underline"
              >
                Edit
              </Link>
            </div>
          </article>
        ))}
      </div>

      {mockPosts.length === 0 && (
        <p className="mt-6 text-center text-gray-600">You have no posts yet. Click "New Post" to create one.</p>
      )}
    </div>
  )
}