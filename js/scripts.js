let dataFromAPI;
let result = document.querySelector(".output");
let typeOfAnimal;

function getToken() {
  return fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "t8TevFbWmSHMyBtkyBPy4vlOyWymZVsi5EyQkHgDhN8AU0x716",
      client_secret: "5RSFBFlq5I9NybMvdpuXXiEDNEgkYGD5dBXMbyH1"
    })
  })
    .then((res) => res.json())
    .then((data) => data.access_token);
}

function getAdoptablePets(formData) {
  let kind = formData.kind;
  typeOfAnimal = kind;
  let zipCode = formData.zip;
  console.log(kind, zipCode);
  let baseURL = `https://api.petfinder.com/v2/animals`;
  let endPoint = `?type=${kind}&location=${zipCode}`;
  let url = baseURL + endPoint;
  console.log(url);
  //first need to call the getToken function, then once that value is returned, you can use the token in the API call
  //they will have to research how to build their link
  getToken().then((token) => {
    fetch(url, {
      //note the token is being used in the header, which they will learn more about in backend
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dataFromAPI = data;
        displayPets(dataFromAPI);
      })
      .catch((error) => console.error("Error message : ", error));
  });
}

//Save the form in a variable
const form = document.querySelector(".pet-form");
//Print form on console
//console.log("form",form);
//Add Event Listener to the form
form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
  //prevent default form behavior
  event.preventDefault();
  //save form data
  const data = new FormData(event.target);
  //Use the boilerplate code to create your data object
  const dataObject = Object.fromEntries(data.entries());
  console.log(dataObject);
  getAdoptablePets(dataObject);
}

function displayPets(data) {
  console.log(data);
  // let objLen = data.len;
  // console.log("Length : ", objLen);
   //Name
  let link = data.animals[0].url;
  //Name
  let name = data.animals[0].name;
  console.log("Name", name);
  // Breed (or "Breed unknown")
  //let breed = data.animals[0].breeds;
  // breed = JSON.stringify(breed);
  let breeds = data.animals[0].breeds;
  breeds = Object.values(breeds);
  let breed = breeds.filter((item) => item!=true && item !=false);
  console.log("breeds", breed);
  // Color (or "Color unknown")
  let colors = data.animals[0].colors;
  console.log("color", colors);
  colors = Object.values(colors);
  let color = colors.filter((item)=> item!= true && item != false && item != null);
  //   console.log("color", color);
  // color= color.toString();

  // Photo (or a placeholder if no photo)
 let imgSrc; 
 if(data.animals[0].photos.length > 0){
      imgSrc = data.animals[0].photos[0].small;
  }
  else{
    imgSrc = "Sorry, no photo available.";
  }

  console.log("image source ", imgSrc);
  let about = data.animals[0].description;
  console.log("about", about);
  // Description (clean up HTML using the provided decodeHTML() function)
  result.classList.remove("display-none");
  let headingTwo = document.createElement("h2");
  headingTwo.textContent = typeOfAnimal;
  result.appendChild(headingTwo);
  let headingThree = document.createElement("h3");
  headingThree.textContent = name;
  result.appendChild(headingThree);
  let pBreed = document.createElement("p");
  pBreed.textContent = "Breed Info. : " + breed;
  result.appendChild(pBreed);
  let pColor = document.createElement("p");
  pColor.textContent = "Color(s) : " + color;
  result.appendChild(pColor);
  if (imgSrc === "Sorry, no photo available." ){
    let pNoPhoto = document.createElement("p");
    pNoPhoto.textContent = imgSrc;
    result.appendChild(pNoPhoto);
  }
  else{
    let img = document.createElement("img");
    img.src = imgSrc;
    img.alt= typeOfAnimal + name;
    result.appendChild(img);
  }
  let pLink = document.createElement("p");
  let readMore = document.createElement("a");
  readMore.textContent="Find More";
  readMore.setAttribute("href",link);
  readMore.setAttribute("target","_blank");
  pLink.appendChild(readMore);
  result.appendChild(pLink);
  let pAbout = document.createElement("p");
  pAbout.textContent = about;
  result.appendChild(pAbout);
  let btnTwo = document.createElement("button");
  btnTwo.textContent = "Try Again";
  result.appendChild(btnTwo);
  btnTwo.addEventListener("click", formReset);
  //console.log("pAbout" , pAbout);
}

//This is the function definition of formReset(). It reloads tha page
function formReset(){
    //reset form
    form.reset();
    // reload the current page
    window.location.reload();
}