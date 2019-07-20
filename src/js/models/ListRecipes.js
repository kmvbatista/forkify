import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items=[]
    }
    addItem(unit, ingredient, count) {
        const item= {
            id: uniqid(),
            unit,
            ingredient,
            count
        }
        this.items.push(item);
        return item;
    }
    
    deleteItem(id) {
        const index= this.items.findIndex(el => el.id===id);
        this.items.splice(index,1);
    }

    updateCount(id, newCount) {
        const item= this.items.find(el => el.id===id);
        item.count= newCount;
    }

}