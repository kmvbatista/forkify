import {elements} from './base';
import {limitTitle} from './searchView';

export const toggleLikeBtn= isLiked => {
     const iconString=  isLiked ? 'icon-heart' : 'icon-heart-outlined';
     document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const renderLikeList= like => {
    const markup= ` <li>
    <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
            <img src="${like.img}" alt="Test">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${limitTitle(like.title)}</h4>
            <p class="likes__author">${like.author}</p>
        </div>
    </a>
</li> `;
document.querySelector('.likes__list').insertAdjacentHTML('beforeend',markup);
}

export const deleteLikeList= id => {
    const li= document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(li){
        li.parentElement.removeChild(li);
    }
}

export const toggleLikeList= numLikes => {
    elements.likesList.style.visibility= numLikes > 0 ? 'visible' : 'hidden';
}