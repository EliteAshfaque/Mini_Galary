import { useEffect, useState } from 'react'
import { fetchPosts, postCover } from '../api'
import { ErrorState, SkeletonList } from '../components/States'
import type { Post } from '../types'

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    setError(null)
    fetchPosts()
      .then(setPosts)
      .catch(() => setError('Could not load posts from JSONPlaceholder.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading && posts.length === 0) return <SkeletonList />
  if (error && posts.length === 0) return <ErrorState message={error} onRetry={load} />

  return (
    <section>
      <div className="page-head">
        <h1>Feed</h1>
        <p>Posts from jsonplaceholder.typicode.com with Picsum covers.</p>
      </div>
      <div className="list">
        {posts.map((post) => (
          <article key={post.id} className="feed-card">
            <img src={postCover(post.id)} alt="" loading="lazy" width={640} height={360} />
            <div>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
