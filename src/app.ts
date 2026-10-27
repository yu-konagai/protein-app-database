export{};
const form  = document.getElementById("form")as HTMLFormElement;
const titleInput = document.getElementById("title")as HTMLInputElement;
const tagsInput = document.getElementById("tags")as HTMLInputElement;
const inproteinInput     = document.getElementById("inprotein")  as HTMLInputElement;
const gramInput    = document.getElementById("gram") as HTMLInputElement;
const searchInput  = document.getElementById("search") as HTMLInputElement;
const proteinList    =document.getElementById("protein-list")as HTMLDivElement;
const cospa =document.getElementById("cospa");
type ProteinType={
    id: number,
    title:string,
    inprotein:string,
    gram:string,
    tags:string[],
    cospa:number,
    isFavorite:boolean,
}

let Proteins:ProteinType[]=[];
let editID:number|null=null;
form.addEventListener("submit",()=>{

    if(editID!==null){
        Proteins=Proteins.map((protein)=>{
        if(editID==protein.id){
            return{
        ...protein,
        title:titleInput.value,
        inprotein:inproteinInput.value,
        gram:gramInput.value,
        cospa:Number(inproteinInput.value)/Number(gramInput.value),
        tags:tagsInput.value.split(',').map(tag=>{
            return tag.trim();
        })}
        
       
    }else{
        return protein}
    });
}else{
    const NewProtein:ProteinType={
        id:Date.now(),
        title:titleInput.value,
        tags:tagsInput.value.split(',').map((tag)=>{
            return tag.trim();
        }),
        inprotein:inproteinInput.value,
        gram:gramInput.value,
        cospa:Number(inproteinInput.value)/Number(gramInput.value),
        isFavorite:false,
        
    }

    Proteins.push(NewProtein);
}

    Proteins.sort((a,b)=>{
        return b.cospa-a.cospa;
});
    titleInput.value="";
    tagsInput.value="";
    inproteinInput.value="";
    gramInput.value="";
renderProtein();
saveProteins();
})


function saveProteins(){
    localStorage.setItem("Proteins",
        JSON.stringify(Proteins));
}
const savedProteins=localStorage.getItem("Proteins")
if(savedProteins){
    Proteins=JSON.parse(savedProteins)
}
    
    function renderProtein(displayProteins:ProteinType[]=Proteins){
    proteinList.innerHTML="";
     displayProteins.forEach((protein)=>{
        const div=document.createElement("div");
        proteinList.appendChild(div);
        div.innerHTML=`
        <p>${protein.title}</p>
        <p>${protein.inprotein}</p>
        <p>${protein.gram}</p>
        <p>コスパ:${Number(protein.inprotein)/Number(protein.gram)}</p>
        `;

        protein.tags.forEach((tag)=>{
            const tagsSpan=document.createElement("span");
            tagsSpan.textContent=`#${tag}`
            tagsSpan.className="tag";
            tagsSpan.addEventListener("click",()=>{
                const tagsFilter =Proteins.filter((protein)=>{
                    return protein.tags.includes(tag);
                });
                renderProtein(tagsFilter);})
            div.appendChild(tagsSpan)})


    const deleteButton=document.createElement("Button")
   deleteButton.textContent="削除";
   div.appendChild(deleteButton);
   deleteButton.addEventListener("click",()=>{
   Proteins=Proteins.filter((item)=>{
       return protein.id !== item.id;
    })
   renderProtein(Proteins);
   saveProteins();}) 
    
    const editButton=document.createElement("button");
    editButton.textContent="編集";
    div.appendChild(editButton);
    editButton.addEventListener("click",()=>{
        editID=protein.id
    })  
    const favoriteButton=document.createElement("button");

    if(protein.isFavorite===true){
        favoriteButton.textContent="★お気に入り"
    }else{
        favoriteButton.textContent="☆お気に入り"
    }    
    favoriteButton.addEventListener("click",()=>{
    protein.isFavorite =!protein.isFavorite;
    renderProtein();
    saveProteins();

    })
    div.appendChild(favoriteButton)


    })

}
    searchInput.addEventListener("input",()=>{
        const searchFilter=Proteins.filter((protein)=>{
            return protein.title.includes(searchInput.value);
        })
        renderProtein(searchFilter);
    })
 renderProtein();
saveProteins();