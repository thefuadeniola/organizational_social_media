// import { UserButton } from "@clerk/nextjs/app-beta/client"
import { fetchThreads } from "@/lib/actions/threads.actions";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";

export default async function Home() {
  const user = await currentUser()
  const result = await fetchThreads(1, 30);
  console.log(result)

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">You're all caught up, no threads found.</p>
        ) : (
          <>
            {result.posts.map((post) =>
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children} />
            )}
          </>
        )}
      </section>
    </>
  )
}
