import axios from "axios";
import 'dotenv/config';

export  async function AuthenticateGoogleUser(token){

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.GOOGLE_KEY}`
    const data = {
        idToken: token
    };

    try {
        const response = await axios.post(url, data);
        const userData = response.data;
        // Faça o processamento necessário com os dados do usuário
        //console.log('Dados do usuário:', userData);
        return userData['users'][0]
      } catch (error) {
        console.error('Erro na solicitação:', error.response.data.error.message);
        return null
    }
    

}