const axios = require('axios');
const {ApolloServer, gql} = require('apollo-server')
const uuid = require('uuid');
const lodash = require('lodash');

const redis = require('redis')
const client = redis.createClient()
const bluebird = require('bluebird')

const md5 = require('blueimp-md5');
const { syntaxError } = require('graphql');
const publickey = 'tfptkRJ7yCUCcbw2-AI38RN987vaX-IIsnbBIOoXHcM';
const privatekey = '_j6G3phto8nciTEOfX2fQ_cpTlAkFjbWnkkTQb_tFJ8';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://api.unsplash.com/photos';
//const url = baseUrl + '?per_page=300' + '&client_id=' + publickey + '&hash=' + hash;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//connect to redis server
client.on('connect', () => {
  console.log('Connected to Redis...')
})

//clean the cache data before running the application
client.flushdb(function (err, succeeded) {
  console.log(succeeded); // will be true if successfull
});


let whole = Array()


async function fetchData(){
    //console.log(param)
    try{
        let reply = await client.getAsync('images')
        if(reply){
            console.log('Sending from cache.....')
            return reply
        }

        const url = baseUrl + '?per_page=1000' + '&client_id=' + publickey + '&hash=' + hash;
        const {data} = await axios.get(url)
        console.log(url)
        
        for(let i in data){
            whole.push({
                id: data[i].id,
                url: data[i].urls.raw,
                posterName: data[i].user.name,
                description: data[i].description,
                userPosted: false,
                binned: false
            })
        }

        red = await client.setAsync('images', whole)
        console.log('Saved in cache.....')
        return JSON.parse(red)
        } catch(e){
        return (e.message)
    }
}

const typeDefs = gql`
    type Query{
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
    }

    type ImagePost{
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
    }

    type Mutation{
        uploadImage(
            url: String!, 
            description: String, 
            posterName: String
        ): ImagePost

        updateImage(
            id: ID!, 
            url: String, 
            posterName: String, 
            description: String, 
            userPosted: Boolean, 
            binned: Boolean
        ): ImagePost

        deleteImage(
            id: ID!
        ): ImagePost 
    }
`;

const resolvers = {
    Query: {
        unsplashImages: async () => {
            if(whole.length != 0){
                return whole
            }
            else{
                return await fetchData()
            }
        },
        binnedImages: async() => {
            let filterData = Array()
            for(i in whole){
                if(whole[i].binned === true){
                    filterData.push(whole[i])
                }
            }
            return filterData           
        },
        userPostedImages: () => {
            let userData = Array()
            for(i in whole){
                if(whole[i].userPosted === true){
                    userData.push(whole[i])
                }
            }
            return userData
        }
    },
    Mutation: {
        uploadImage: (_, args) => {
            const newImage = {
                id: uuid.v4(),
                url: args.url,
                description: args.description,
                posterName: args.posterName,
                binned: false,
                userPosted: true
            }
            whole.push(newImage)
            return newImage
        },
        updateImage: (_, args) => {
            let nImage;
            whole = whole.map((e) => {
                if(e.id === args.id){
                    if(args.url){
                        e.url = args.url
                    }
                    if(args.description){
                        e.description = args.description
                    }
                    if(args.posterName){
                        e.posterName = args.posterName
                    }
                    if(args.binned){
                        e.binned = args.binned
                    }
                    if(args.userPosted){
                        e.userPosted = args.userPosted
                    }
                    nImage = e
                    return e
                }
                return e
            })
            return nImage
        },
        deleteImage: (_, args) => {
            return lodash.remove(whole, (e) => e.id == args.id)[0]
        }
    }
}
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
