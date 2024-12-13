import algoliasearch from "algoliasearch";
import 'dotenv/config';

const application_id=process.env.APPLICATION_ID
const admin_api_key=process.env.ADMIN_API_KEY

export class SearchPosts{


    instance_algolia
    index_post
    

    constructor(){
        this.instance_algolia = algoliasearch(application_id, admin_api_key)
        this.index_post = this.instance_algolia.initIndex('Posts')

    }


    async  search_posts(query){
        try {
            const { hits } = await this.index_post.search(query);
    
            return hits;
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            // Você pode optar por lançar o erro novamente ou lidar com ele de outra forma
            
        }
        return []
    }

    async registerPost(post){
        try{
            await this.index_post.saveObject(post).then(() => {});
            
        }catch(e){
            console.log(e)
        }
        
    }

    async updatePost(post){

        try{
            await this.index_post.partialUpdateObject(post).then(({ objectID }) => {
                console.log(objectID);
            });
    
        }catch(e){
            console.log(e)
        }

    }

    async deletePost(postId){

        try{
            await this.index_post.deleteObject(postId).then(() => {
            });
    
        }catch(e){
            
        }
    }

}

