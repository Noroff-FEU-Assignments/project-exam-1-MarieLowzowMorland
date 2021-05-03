import addHeaderForPage, { pageNames } from "../templates/header.js";
import addFooterForPage from "../templates/footer.js";
import { findPosts } from "../data/dataFromApi.js";

addHeaderForPage(pageNames.ALL_POSTS);
addFooterForPage();

const searchParameters = new URLSearchParams(location.search);

const topic = searchParameters.get("topic");
const search = searchParameters.get("text");

let fetchingPosts = true;
let pageNumber = 1;

const postToHtml = (post) => {
  const { id, dateString, title, summary, featuredImage} = post;

  return /*template*/`
    <div>
      <p>${dateString}</p>
      <h2>${title}</h2>
      <img height="200" src="${featuredImage.src}">
      <div class="article-introduction">${summary}</div>
      <a href="post.html?id=${id}">Read more </a>
    </div>   
  `;
};

const fetchMorePosts = async (event) => {
  event.stopPropagation();
  if(fetchingPosts){
    return;
  }

  fetchingPosts = true;
  const newPosts = await findPosts(++pageNumber, topic, search);
  
  if(!newPosts){
    document.getElementById("more-posts").classList.add("hidden");
    return;
  }


  const htmlPosts = newPosts.map(postToHtml);
  document.getElementById("posts-container").insertAdjacentHTML("beforeend", htmlPosts.join(""));
  fetchingPosts = false;
}

const addPostsToHtml = (posts) => {
  const htmlPosts = posts.map(postToHtml)
  const search = document.getElementById("search-container");

  const firstPost = htmlPosts.shift();
  search.insertAdjacentHTML("beforebegin", firstPost);
  search.insertAdjacentHTML("afterend", htmlPosts.join(""));
  fetchingPosts = false;

  document.getElementById("more-posts").addEventListener("click", fetchMorePosts);
};


findPosts(pageNumber, topic, search).then(addPostsToHtml);