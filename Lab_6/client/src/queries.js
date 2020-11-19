import {gql} from '@apollo/client'

const GET_ALL = gql`
    query{
        unsplashImages{
            id,
            description,
            url,
            posterName,
            binned
        }
    }
`;

const GET_BIN = gql`
    query{
        binnedImages{
            id, 
            description,
            url,
            posterName
        }
    }
`;

const GET_USER_POSTED = gql`
    query{
        userPostedImages{
            id,
            description,
            url,
            posterName
        }
    }
`;

const ADD_IMAGE = gql`
    mutation uploadImage(
        $url: String!,
        $description: String,
        $posterName: String
    ){
        uploadImage(
            url: $url,
            description: $description,
            posterName: $posterName
        ){
            id,
            description,
            url,
            posterName,
            binned,
            userPosted
        }
    } 
`;

const UPDATE_IMAGE = gql`
    mutation updateImage(
        $id: ID!, 
        $url: String, 
        $posterName: String, 
        $description: String, 
        $userPosted: Boolean, 
        $binned: Boolean
    ){
        updateImage(
            id: $id, 
            url: $url, 
            posterName: 
            $posterName, 
            description: $description, 
            userPosted: $userPosted, 
            binned: $binned
        ){
            id,
            description,
            posterName,
            binned,
            url
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation deleteImage(
        $id: ID!
    ){
        deleteImage(
            id: $id
        ){
            id,
            description,
            posterName,
            url
        }
    }
`;

export default{
    GET_ALL,
    ADD_IMAGE,
    UPDATE_IMAGE,
    GET_BIN,
    GET_USER_POSTED,
    DELETE_IMAGE
}