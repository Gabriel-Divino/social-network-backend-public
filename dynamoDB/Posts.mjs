import { ddbDocClient } from "./connect.mjs";
import {  GetCommand ,PutCommand,UpdateCommand,QueryCommand,DeleteCommand  } from "@aws-sdk/lib-dynamodb";
import { SearchPosts } from "../Algolia/search-posts.mjs";

export class Posts{


    instance_algolia

    constructor(){
      this.instance_algolia =  new SearchPosts()
    }

    async getPost(userId, postId) {
        const params = {
          TableName: 'Posts',
          Key: {
            user_id: userId,
            post_id: postId,
          },
        };
      
        try {
          const data = await ddbDocClient.send(new GetCommand(params));
          if (data.Item) {
            console.log("Success - item:", data.Item);
            return data.Item
          } else {
            console.log("No item found with the given key.");
          }
        } catch (err) {
          console.error("Error", err);
        }
    }


    async insertPost(document){
      const params = {
        TableName: "Posts",
        Item: document
      };
    
      try {
        const data = await ddbDocClient.send(new PutCommand(params));
        await this.instance_algolia.registerPost(document)
        console.log("Item inserido com sucesso:", data);
      } catch (err) {
        console.error("Erro ao inserir item:", err);
      }

    }

    async updatePost(document){
      const params = {
        TableName: "Posts",
        Key: {
          user_id: document['user_id'],
          post_id:document['post_id']
        },
        UpdateExpression: "set #postTitle = :postTitle, #postDescription = :postDescription, #images = :images",
        ExpressionAttributeNames: {
          "#postTitle": "postTitle",
          "#postDescription": "postDescription",
          "#images":"images"
        },
        ExpressionAttributeValues: {
          ":postTitle": document['postTitle'],
          ":postDescription": document['postDescription'],
          ":images":document['images']
        },
        ReturnValues: "ALL_NEW" // Retornar os valores atualizados
      };
    
      try {
        const data = await ddbDocClient.send(new UpdateCommand(params));
        await this.instance_algolia.updatePost(document)
        console.log("Item atualizado com sucesso:", data);
      } catch (err) {
        console.error("Erro ao atualizar item:", err);
      }
    };


    async deletePost(document){
      const params = {
        TableName: "Posts",
        Key: {
          user_id: document['user_id'],
          post_id:document['post_id']           // Substitua pelo nome real da sua chave de classificação
        }
      };
    
      try {
        const data = await ddbDocClient.send(new DeleteCommand(params));
        await this.instance_algolia.deletePost(document['post_id'])
        console.log("Item deletado com sucesso:", data);
        return data;
      } catch (err) {
        console.error("Erro ao deletar item:", err);
        throw err;
      }

    }

    async getPostsFromUser(user_id){

      const params = {
        TableName: "Posts",
        KeyConditionExpression: "#user_id = :user_id",
        ExpressionAttributeNames: {
          "#user_id": "user_id" // Substitua pelo nome real da sua chave de partição
        },
        ExpressionAttributeValues: {
          ":user_id": user_id
        },
        Limit: 10 ,// Limitar a 10 itens
        ScanIndexForward: false 
      };
      try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        return data.Items;
      } catch (err) {
        console.error("Erro ao buscar itens:", err);
        return [];
      }


    }

    async catchTheLatestPosts(day){
      const params = {
        TableName: "Posts",
        IndexName: "postDay-postTime-index",
        KeyConditionExpression: "#pd = :postDay",
        ExpressionAttributeNames: {
          "#pd": "postDay" // Substitua pelo nome real do seu atributo postDay
        },
        ExpressionAttributeValues: {
          ":postDay": day
        },
        Limit: 10, // Limitar a 10 itens
        ScanIndexForward: false // Inverter a ordem dos resultados
      };
    
      try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        return data.Items;
      } catch (err) {
        console.error("Erro ao buscar itens:", err);
        return [];
      }
   
    }

}