export type View = 'gallery' | 'feed' | 'people'

export type Photo = {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export type Post = {
  id: number
  userId: number
  title: string
  body: string
}

export type Person = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
  }
  address: {
    city: string
  }
}

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
