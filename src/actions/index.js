export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'

export const selectReddit = reddit => ({
    type: SELECT_REDDIT,
    reddit
})
export const invalidateReddit = reddit => ({
    type: INVALIDATE_REDDIT,
    reddit
})

export const requestPosts = reddit => ({
    type: REQUEST_POSTS,
    reddit
})

//收到响应后 dispatch receivePosts action
export const receivePosts = (reddit, json) => {
    return {
        type: RECEIVE_POSTS,
        reddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}
//thunk action (异步 action)创建函数！
const fetchPosts = reddit => dispatch => {                      // 这里把 dispatch 方法通过参数的形式传给函数，以此来让它自己也能 dispatch action。
    dispatch(requestPosts(reddit))
    return fetch(`https://www.reddit.com/r/${reddit}.json`)
        .then(response => response.json())
        .then(json => {dispatch(receivePosts(reddit, json))})//thunk 返回的结果可以被再次 dispatch();到此处为止异步数据流结束,
                                                             //并dispatch 一个同步 action(receivePosts(reddit, json)) 作为结束的标志
}

const shouldFetchPosts = (state, reddit) => {
    const posts = state.postsByReddit[reddit]
    if (!posts) {
        return true
    }
    if (posts.isFetching) {
        return false
    }
    return posts.didInvalidate
}

/*export const fetchPostsIfNeeded = reddit => (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
        return dispatch(fetchPosts(reddit))
    }
}*/
export function fetchPostsIfNeeded(reddit) {
    return function (dispatch, getState) {
        if (shouldFetchPosts(getState(), reddit)) {
            console.log(fetchPosts(reddit).toString());
            return dispatch(fetchPosts(reddit));
        }
    }
}
