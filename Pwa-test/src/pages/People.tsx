import { useEffect, useState } from 'react'
import { avatarUrl, fetchPeople } from '../api'
import { ErrorState, SkeletonList } from '../components/States'
import type { Person } from '../types'

export function People() {
  const [people, setPeople] = useState<Person[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    setError(null)
    fetchPeople()
      .then(setPeople)
      .catch(() => setError('Could not load people from JSONPlaceholder.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading && people.length === 0) return <SkeletonList count={5} />
  if (error && people.length === 0) return <ErrorState message={error} onRetry={load} />

  return (
    <section>
      <div className="page-head">
        <h1>People</h1>
        <p>Users from JSONPlaceholder with avatars from pravatar.cc.</p>
      </div>
      <div className="list">
        {people.map((person) => (
          <article key={person.id} className="person-card">
            <img src={avatarUrl(person.id)} alt="" width={56} height={56} />
            <div>
              <h2>{person.name}</h2>
              <p>
                @{person.username} · {person.address.city}
              </p>
              <p className="muted">
                {person.company.name} — {person.company.catchPhrase}
              </p>
              <a href={`mailto:${person.email}`}>{person.email}</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
