import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

import reactionEmoji from './reactionEmoji'

const getInitialPostReactions = () => {
    return Object.keys(reactionEmoji).reduce(
        (postReactions, reactionName) => {
            postReactions[reactionName] = 0;
            return postReactions;
        }, 
        {}
    )
}

const initialState = [
    { 
        id: '1', 
        title: 'First Post!', 
        content: 'Hello!',
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: getInitialPostReactions(),
    },
    { 
        id: '2', 
        title: 'Second Post',
        content: 'More text',
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: getInitialPostReactions(),
    }
]

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const {postId, reaction } = action.payload
            const post = state.find(post => post.id === postId)
            if (post) {
                post.reactions[reaction] = post.reactions[reaction] + 1
            }
        },
        postAdded: {
            reducer(state, action) {
                state.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId,
                        reactions: getInitialPostReactions(),
                    }
                }
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.find(post => post.id === id)
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        }
    }
})

export const { reactionAdded, postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer