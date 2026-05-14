/** @jsx jsx */
// Abuse: monitor read/write quotas in Firebase Console; add IP limits or CAPTCHA only if needed.
import * as React from "react"
import { collection, doc, getCountFromServer, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore"
import { getAuth, signInAnonymously } from "firebase/auth"
import { Box, Button, jsx, Text } from "theme-ui"
import { getFirebaseApp, isFirebaseConfigured, postSlugToFirestoreDocId } from "../lib/firebase"

const likedStorageKey = (postId: string) => `blog-post-liked:${postId}`

type PostLikeButtonProps = {
  postSlug: string
}

const PostLikeButton: React.FC<PostLikeButtonProps> = ({ postSlug }) => {
  const postId = postSlugToFirestoreDocId(postSlug)
  const [ready, setReady] = React.useState(false)
  const [count, setCount] = React.useState<number | null>(null)
  const [hasLiked, setHasLiked] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isFirebaseConfigured()) {
      return
    }

    let cancelled = false

    const run = async () => {
      const app = getFirebaseApp()
      if (!app) {
        return
      }
      const auth = getAuth(app)
      const db = getFirestore(app)

      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth)
        }
        const uid = auth.currentUser?.uid
        if (!uid) {
          return
        }

        const voters = collection(db, `postLikes`, postId, `voters`)
        const voterRef = doc(db, `postLikes`, postId, `voters`, uid)

        const [countSnap, voterSnap] = await Promise.all([getCountFromServer(voters), getDoc(voterRef)])

        if (cancelled) {
          return
        }

        setCount(countSnap.data().count)
        const stored = typeof localStorage !== `undefined` && localStorage.getItem(likedStorageKey(postId)) === `1`
        setHasLiked(voterSnap.exists() || stored)
      } catch (e) {
        if (!cancelled) {
          setError(`Could not load likes.`)
        }
      } finally {
        if (!cancelled) {
          setReady(true)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [postId])

  const onLike = async () => {
    if (!isFirebaseConfigured() || hasLiked || submitting || count === null) {
      return
    }
    const app = getFirebaseApp()
    if (!app) {
      return
    }
    const auth = getAuth(app)
    const db = getFirestore(app)
    setSubmitting(true)
    setError(null)
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth)
      }
      const uid = auth.currentUser?.uid
      if (!uid) {
        throw new Error(`no uid`)
      }
      const voterRef = doc(db, `postLikes`, postId, `voters`, uid)
      await setDoc(voterRef, { createdAt: serverTimestamp() })
      try {
        localStorage.setItem(likedStorageKey(postId), `1`)
      } catch {
        // ignore quota / private mode
      }
      setHasLiked(true)
      const countSnap = await getCountFromServer(collection(db, `postLikes`, postId, `voters`))
      setCount(countSnap.data().count)
    } catch (e) {
      setError(`Could not save like.`)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isFirebaseConfigured()) {
    return null
  }

  return (
    <Box sx={{ my: 4, display: `flex`, flexWrap: `wrap`, alignItems: `center`, gap: 3 }}>
      {ready && count !== null ? (
        <Text sx={{ color: `secondary`, fontSize: 1 }}>
          {count} {count === 1 ? `like` : `likes`}
        </Text>
      ) : (
        <Text sx={{ color: `secondary`, fontSize: 1 }}>{ready ? error ?? `—` : `…`}</Text>
      )}
      <Button
        type="button"
        disabled={!ready || hasLiked || submitting || count === null || Boolean(error)}
        onClick={() => void onLike()}
        sx={{ cursor: hasLiked ? `default` : `pointer` }}
      >
        {hasLiked ? `Liked` : submitting ? `Saving…` : `Like`}
      </Button>
    </Box>
  )
}

export default PostLikeButton
