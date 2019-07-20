export default class Likes {

    constructor() {
        this.likes=[];
    }

    addLike(id, title, author, img) {
        const like={id, title, author, img};
        this.likes.push(like);
        this.persistData();
        return like;
        //persist data
    }

    deleteLike(id) {
        const index= this.likes.findIndex(el => el.id===id);
        this.likes.splice(index, 1);
        //persist data
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id===id)!=-1;
    }

    getNumlikes() {
        return this.likes.length;
    }
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));  
    }

    readLocalStorage() {
        const storage= JSON.parse(localStorage.getItem('likes'));
        if(storage[0].id) {
            this.likes= storage;
        }
    }
}