import axios from 'axios';



export const registerUser = async (body) => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000/api/auth/register',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(body)
    };

    return await axios(config);
}



export const loginUser = async (body) => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000/api/auth/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(body)
    };

    return await axios(config);
}
