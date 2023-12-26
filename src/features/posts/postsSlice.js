import { createSlice, nanoid } from '@reduxjs/toolkit'

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

const initialState = {
    posts: [],
    status: 'idle',
    error: null,
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                // since this is within createSlice, the state param here is actually state.posts
                state.posts.push(action.payload)
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
        reactionAdded(state, action) {
            const {postId, reaction } = action.payload
            const post = state.posts.find(post => post.id === postId)
            if (post) {
                post.reactions[reaction] = post.reactions[reaction] + 1
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.posts.find(post => post.id === id)
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        }
    }
})

export const { reactionAdded, postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer


// since this is outside of createSlice, we have to write out the extra `.posts`
export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>  
    state.posts.posts.find(post => post.id === postId)

