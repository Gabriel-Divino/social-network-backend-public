import { Router } from 'express';
import { Posts } from '../dynamoDB/Posts.mjs';
import { AuthenticateGoogleUser } from '../Google/auth.mjs';
import { SearchPosts } from '../Algolia/search-posts.mjs';


function generateShortId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
}

const router = Router();


router.get('/', async (req, res) => {
    const posts = new Posts()
    const request = req.query
    let response = await posts.getPost(request.userId,request.postId)
    res.json(response);
});

router.post('/',async (req,res)=>{

    const response = {}
    
    try{
        
        const token = req.headers['authorization']
        const user = await AuthenticateGoogleUser(token)
        const document = req.body
        document['user_id'] = user['localId']
        document['post_id'] = generateShortId()
        document['objectID'] =  document['post_id']

        const date = new Date()
        document['postDay'] = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        document['postTime'] = date.toISOString()

        const posts = new Posts()
        await posts.insertPost(document)

        response['status'] = 'ok'

    }catch(e){
        response['status'] = 'error'
    }


    res.json(response)
})

router.put('/',async(req,res)=>{
    const response = {}

    try{
        const token = req.headers['authorization']
        const user = await AuthenticateGoogleUser(token)
        const document = req.body
        document['user_id'] = user['localId']
        document['objectID'] =  document['post_id']
        const posts = new Posts()
        await posts.updatePost(document)


        response['status'] = 'ok'

    }catch(e){
        response['status'] = 'error'
    }

    res.json(response)
})


router.delete('/',async(req,res)=>{
    const response = {}

    try{
        const token = req.headers['authorization']
        const user = await AuthenticateGoogleUser(token)
        const document = req.body
        document['user_id'] = user['localId']
        const posts = new Posts()
        await posts.deletePost(document)


        response['status'] = 'ok'

    }catch(e){
        response['status'] = 'error'
    }

    res.json(response)
})


router.get('/user',async(req,res)=>{
    const posts = new Posts()
    const results = await posts.getPostsFromUser(req.query.userId)
    res.json(results)

})


router.get('/latest-posts',async(req,res)=>{
    const posts = new Posts()
    var date
    console.log(req.query.date)
    if(req.query.date != null){
        date = req.query.date
    }else{
        date =  new Date()
        date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
    }
    

    const results = await posts.catchTheLatestPosts(date)
    res.json(results)
})

router.get('/search',async(req,res)=>{

    const instance = new SearchPosts()
    const results = await instance.search_posts(req.query.q)
    res.send(results)

})

export default router;