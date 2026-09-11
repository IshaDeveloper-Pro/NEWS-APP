const API_KEY = "WARomN4zBlOtl3WwriZGWuvv528yeLu16lC6O1xoNuypZjRR";
const searchUrl = `https://api.currentsapi.services/v1/search?apiKey=${API_KEY}&keywords=`;
const categoryUrl = `https://api.currentsapi.services/v1/latest-news?apiKey=${API_KEY}&category=`;

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
        const res = await fetch(`${searchUrl}${query}`);
        const data = await res.json();
        // Currents API returns articles in the 'news' array
        bindData(data.news);
    } catch (error) {
        console.log("Error fetching news: ", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    if (!cardsContainer || !newsCardTemplate) return;
    cardsContainer.innerHTML = '';

    if (!articles) return;

    articles.forEach(article => {
        // Currents API uses 'image' instead of 'urlToImage' (handle 'None' string or empty)
        if (!article.image || article.image === "None") return;
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

    if (newsImg) newsImg.src = article.image;
    if (newsTitle) newsTitle.innerHTML = article.title;
    if (newDesc) newDesc.innerHTML = article.description;

    const date = new Date(article.published).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    // Currents API provides source as a string directly
    const sourceName = article.author || article.source || "News";
    if (newsSource) newsSource.innerHTML = `${sourceName} - ${date}`;

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
    curSelectedNav?.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');
    
if(searchButton && searchText) {
    searchButton.addEventListener('click', () => {
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
        searchText.value = "";
        curSelectedNav?.classList.remove('active');
        curSelectedNav = null;
        
        searchButton.style.transform = "scale(0.85)";
        setTimeout(() => {
            searchButton.style.transform = "scale(1)";
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
            
            searchButton.classList.add("is-active");
            setTimeout(() => {
                searchButton.classList.remove("is-active");
            }, 150);
        } 
    });
}

const toggleBtn = document.getElementById('nav-toggle');
const mainPart = document.querySelector('main');

if(toggleBtn && mainPart) {
    toggleBtn.addEventListener('click', () => {
        mainPart.classList.toggle('main-shift');
    });
}

const navItems = document.querySelectorAll('.nav-item');
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