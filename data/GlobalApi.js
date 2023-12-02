import { create } from "apisauce";

const api = create({
  baseURL: 'https://newsapi.org/v2',
});
const apiKey = "?country=us&apiKey=7d917896b68f4154a7be864515c9cf43";

const getTopHeadline = api.get('/top-headlines'+apiKey);

export default{
    getTopHeadline
}
//    /top-headlines