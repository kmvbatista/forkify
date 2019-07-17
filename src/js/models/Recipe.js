import axios from 'axios';
import {key, proxy} from '../config';
import { Fraction } from 'fractional';

export default class Recipe{
    constructor(id) {
        this.id= id;
    }

    async getRecipe() {
        try {
            const res= await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            console.log(`resposta do axios: `)
            
            console.log(res)
            this.title=res.data.recipe.title;
            this.author= res.data.recipe.publisher;
            this.img=res.data.recipe.image_url;
            this.url= res.data.recipe.source_url;
            this.ingredients= res.data.recipe.ingredients;
        }
        catch(error) {
            console.log(`erro no getRecipe: ${error.message}`);
        }
    }

    calcTime() {
        //assuming that we have 15 minutes for each 3 ingredients
        console.log(this.ingredients);
        const numIng= this.ingredients.length;
        const periods= Math.ceil(numIng/3);
        this.time= periods*15;  
    }

    calcServing() {
        this.servings= 4; 
    }

    parseIngredients() {
        try{
            //1) Uniform units 
            const unitLong= ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
            const unitShort= ['tbs', 'tbs', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
            const units= [...unitShort, 'kg', 'g'];
            const newIngredients= this.ingredients.map(el => {
                let ingredient= el.toLowerCase();
                unitLong.forEach((cur, index)=>{
                    ingredient=ingredient.replace(cur, units[index]);
                });
                //2) remove parentheses
                ingredient= ingredient.replace(/ *\([^)]*\) */g, ' ');
                //3) Parse ingredients into count, unit and ingredients
                const arrIng= ingredient.split(' ');

                const unitIndex= arrIng.findIndex(el2 => unitShort.includes(el2));
                
                let objIng;
                if(unitIndex>-1) {
                    //there's a unit
                    const arrCount= arrIng.slice(0, unitIndex);

                    let count;
                    if(arrCount.length===1){
                    count= eval(arrCount[0].replace('-', '+'));
                    }
                    else {
                        count=eval(arrIng.slice(0, unitIndex).join('+'));  
                    }
                    
                    objIng= {
                        count,
                        unit: arrIng[unitIndex],
                        ingredient: arrIng.slice(unitIndex+1).join(' ')
                    }
                }
                else if(parseInt(arrIng[0], 10)) {
                    //there's NO unit, but the 1st element is a number
                    objIng= {
                        count: parseInt(arrIng[0], 10),
                        unit: '', 
                        ingredient: arrIng.splice(0).join(' ')
                    }
                }
                else if(unitIndex===-1) {
                    //there's no either unit or number in the 1st posittion
                    objIng= {
                        count: 1,
                        unit: '',
                        ingredient: ingredient 
                    }
                }
                return objIng;
            });
            this.ingredients= newIngredients;
        }
        catch(error) {
            alert(`erro nas conversões: ${error.message}`)
        }
            
    }
}