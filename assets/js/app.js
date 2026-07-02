
let BaseURL = 'https://fakestoreapi.com'; 

let productUrl = `${BaseURL}/products`; 





const spinner  =document.getElementById('spinner');
const descriptionControl = document.getElementById('description');
const priceControl = document.getElementById('price');
const imageControl = document.getElementById('image');
const titleControl = document.getElementById('title');

const productForm  =document.getElementById('productForm');

const productContainer  =document.getElementById('productContainer');

const addProduct  =document.getElementById('addProduct');
const updateProduct  =document.getElementById('updateProduct');









function snackbar(msg,icon){ 
      swal.fire({ 
            title:msg,
            icon:icon,
            timer:3000
      })
}


function tooltip(){ 
     $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        })
}











function fetchProduct(){  
    
    fetch(productUrl,{ 
           method:'GET',
           headers:{ 
              'content-type':'applicaiotn/json',
              Auth:'Get token '
           }

    })

    .then((res)=>{
            console.log(res);
             return res.json()
         }
                
     )                 
    .then((data)=>{ 
            createCards(data);                        
     }) 
     .catch((err)=>{ 
          snackbar(err,'error');
     })
     .finally(()=>{ 
          spinner.classList.add('d-none');
    })
}




fetchProduct();


function createCards(arr){
       let res =" "; 
       arr.forEach((ele)=>{ 
            res +=`<div class="col-md-4 mb-4 mt-4" id=${ele.id}>
                <div class="card productCard h-100">
                    <div class="card-header bg-primary text-light text-center">
                          <h4>Product</h4>
                    </div>
                      <div class="card-body">
                        <figure>
                             <img src="${ele.image}" alt="">
                            <figcaption>
                               <h4>${ele.title}</h4>
                                <p>${ele.description}</p>
                                <h4><span class="bg-primary">${ele.price}$</span></h4>   
                            </figcaption>
                        </figure>
                    </div>

                    <div class="card-footer d-flex justify-content-between ">
                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-warning">Remove</button>
                        
                    </div>
                </div>

            </div>`
       });

       productContainer.innerHTML= res ;
}


function onSubmit(eve){ 
          eve.preventDefault();

   let newObj ={ 
           title:titleControl.value,
           description:descriptionControl.value,
           price:priceControl.value,
           image:imageControl.value,
          

   }


    fetch(productUrl,{ 
            method:'POST',
            body:JSON.stringify(newObj),
            headers:{ 
              'content-type':'applicaiotn/json',
              Auth:'Get token '  
            }
    }) 
    .then((res)=>{ 
        return res.json();
    })

    .then((data)=>{
        createSingleCard(data);
        snackbar('product created successfully..', 'success');
    })

    .catch((err)=>{ 
          snackbar(err,'error');
     })
     .finally(()=>{ 
          spinner.classList.add('d-none');
    })
}


function createSingleCard(newObj){
            let div =document.createElement('div');
              div.id = newObj.id ;
              div.innerHTML= `<div class="card productCard h-100">
                                <div class="card-header bg-primary text-light text-center">
                                    <h4>Product</h4>
                                </div>
                                <div class="card-body">
                                    <figure>
                                        <img src="${newObj.image}" alt="">
                                        <figcaption>
                                        <h4>${newObj.title}</h4>
                                            <p>${newObj.description}</p>
                                            <h4><span class="bg-primary">${newObj.price}$</span></h4>   
                                        </figcaption>
                                    </figure>
                                </div>

                                <div class="card-footer d-flex justify-content-between ">
                                    <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                    <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-warning">Remove</button>
                                    
                                </div>
                            </div>`



}





function onRemove(ele){
           let removeId= ele.closest('.col-md-4').id;
           let removeUrl = `${productUrl}/${removeId}`;

           fetch(removeUrl,{
                method:'DELETE',
                headers:{
                   'content-type':'applicaiotn/json',
                   Auth:'Get token '    
                }
           })
           .then((res)=>{ 
                  if(!res.ok){ 
                       throw new  Error(res)
                  }  
                  return ;  
           })
           .then(()=>{ 
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                    }).then((result) => {
                   
                   if(result.isConfirmed){
                          document.getElementById(removeId).remove();
                          snackbar('delete successfully','success');
                        }
                    });

           })
           .catch((err)=>{ 
              snackbar(err,'error')
           })
           .finally(()=>{  
              spinner.classList.add('d-none');
           })
} 



function onEdit(ele){
     spinner.classList.remove('d-none');
      let editId= ele.closest('.col-md-4').id;
       localStorage.setItem('editId',editId);
      let editUrl=`${productUrl}/${editId}`;

      fetch(editUrl,{ 
           method:'GET',
           headers:{ 
               'content-type':'applicaiotn/json',
                Auth:'Get token '
           }
      })
      .then((res)=>{ 
          if(res.ok){ 
              return res.json();   
            
            }else{ 
                 throw new Error(res);
            }
      })
      .then((editObj)=>{ 
           titleControl.value =editObj.title;
           descriptionControl.value =editObj.description;
           imageControl.value =editObj.image;
           priceControl.value =editObj.price; 

           addProduct.classList.add('d-none');
           updateProduct.classList.remove('d-none');
           
           window.scrollTo({top:0,behavior:'smooth'})
      })
      .catch((err)=>{ 
         snackbar(err,'error')
        })
      .finally(()=>{  
         spinner.classList.add('d-none');
        })
}




function onUpdate(){
   let updateId= localStorage.getItem('editI');
   let updateUrl = `${productUrl}/${updateId}`;

   let updateObj={ 
           title:titleControl.value,
           description:descriptionControl.value,
           price:priceControl.value,
           image:imageControl.value,
          
         }

   fetch(updateUrl,{ 
            method:'PATCH', 
            headers:{
                'content-type':'applicaiotn/json',
                Auth:'Get token '
            }, 
            body:JSON.stringify(updateObj)
   }) 

   .then((res)=>{ 
             if(res.OK){
                return res.json(); 
             }else{ 
                 throw new Error(res);
             }
   })
  .then(()=>{ 
     let div =  document.getElementById(updateId);   
               div.innerHTML =`<div class="card productCard h-100">
                                <div class="card-header bg-primary text-light text-center">
                                    <h4>Product</h4>
                                </div>
                                <div class="card-body">
                                    <figure>
                                        <img src="${updateObj.image}" alt="">
                                        <figcaption>
                                        <h4>${updateObj.title}</h4>
                                            <p>${updateObj.description}</p>
                                            <h4><span class="bg-primary">${updateObj.price}$</span></h4>   
                                        </figcaption>
                                    </figure>
                                </div>

                                <div class="card-footer d-flex justify-content-between ">
                                    <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                    <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-warning">Remove</button>
                                    
                                </div>
                            </div>`
            addProduct.classList.add('d-none');
           updateProduct.classList.remove('d-none');
           productForm.reset();
           div.scrollIntoView({block:'center',behavior:'smooth'});
           snackbar('Updated successfullly...', 'success');
  })
 .catch((err)=>{ 
         snackbar(err,'error')
        })
      .finally(()=>{  
         spinner.classList.add('d-none');
        })  
}









productForm.addEventListener('submit', onSubmit);

updateProduct.addEventListener('click', onUpdate);