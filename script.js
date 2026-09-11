const API_KEY = "853c5634376d4b53bc4425977990282f";
const searchUrl = "https://newsapi.org/v2/everything?q=";
const categoryUrl = "https://newsapi.org/v2/top-headlines?country=in&category=";

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
        
    if(navToggle && navLinks){
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

window.addEventListener('load', () => fetchNews("India"));

function reload() {
    window.location.reload();
}


async function fetchNews(query) {
    try {
        const res = await fetch(`${searchUrl}${query}&apiKey=${API_KEY}`);
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.log("Error fetching news: ", error);
    }
}
function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = '';

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US",
        {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} - ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}


let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');
    
searchButton.addEventListener('click', () => {
    
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    searchText.value = "";
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
    /*for enter button transition now*/
    searchButton.style.transform = "scale(0.85)";
    setTimeout(() => {
        searchButton.style.transform = "scale(1);"
    }, 150);

    });

searchText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
    const query = searchText.value;
    if (!query) return;
        fetchNews(query);
        searchText.value = "";
    curSelectedNav?.classList.remove('active');
        curSelectedNav = null;
         /*for enter button transition now*/
        searchButton.classList.add("is-active");
    setTimeout(() => {
        searchButton.classList.remove("is-active");
    }, 150);
    } 
    
});
const toggleBtn = document.getElementById('nav-toggle');
const mainPart = document.querySelector('main');

toggleBtn.addEventListener('click', () => {
    mainPart.classList.toggle('main-shift');
});

const navItems = document.querySelectorAll('.nav-item');
navItems.counter = 0; // just loop reference
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('id');
        onNavItemClick(category);
    });
});

const homeButton = document.getElementById('home-button');
if(homeButton) {
    homeButton.addEventListener('click', () => {
        reload();
    });
}