import dotenv from 'dotenv'
dotenv.config();

const getOpenAIAPIResponse = async (message) => {

        const options = {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAPIKEY}`
            },
            body: JSON.stringify({
                model:"gpt-4o-mini",
                messages:[{
                    role:"user",
                    content: message
                }]
            })
        }

        try{
            const response = await fetch("https://api.openai.com/v1/chat/completions", options);
            const data  = await response.json();
            return data.choices[0].message.content; //Doubt
        }catch(err){
            console.log(err)
        }
}

export default getOpenAIAPIResponse;