

interface GenerationPostRequest {
    title : string;
    caption : string;
    hashtags : string;
    platform : string;
}

interface GenerationTranslation {
    input : string;
    output : string;
    content : string;
}

const requestApiPost = 'http://caleido-hope-ai.byfcbwdcazc9caey.eastus.azurecontainer.io:8080/predict/post-inference';
const requestApiTranslate = '';

export async function send_post_for_generation (post : GenerationPostRequest) {
    
    const response = await fetch(
        requestApiPost, {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "title":post.title,
                "caption"  : post.caption,
                "hashtags" : post.hashtags,
                "platform" : post.platform
            })
        }
    );

    const data = await response.json();
    return data;
}


export async function translate_text (translate : GenerationTranslation) {
    
    const response = await fetch(
        requestApiTranslate, {
            method : "POST",
            body: JSON.stringify(translate)
        }
    );

    const data = await response.json();
    return data;
};

