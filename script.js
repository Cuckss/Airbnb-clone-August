const searchButton = document.getElementById("search-button");
let searchlistingContainer=document.getElementById("listings-container");

searchButton.addEventListener('click',()=>{
    const searchInput=document.getElementById('search-input').value;
    
    const apiKey='b09bef8d1dmshd28b99405c5e161p12c4e6jsn6f240fd22e17';
    const url = `https://airbnb13.p.rapidapi.com/search-location?location=${searchInput}&checkin=2023-09-16&checkout=2023-09-17&adults=1&children=0&infants=0&pets=0&page=1&currency=USD`;
    fetch(url, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com',
            'X-RapidAPI-Key': apiKey
        }
    })
        .then(response => response.json())
        .then(data => {
            // Your code to handle and display the response data goes here
            console.log(data.results); // You can inspect the data in the console
            createListingData(data.results);
        })
        // .catch(error => console.error('Error:', error));
       
});
function createListingData(data){
   searchlistingContainer.innerHTML='';
    data.forEach(datas => {
        let listingCard=document.createElement("div");
        listingCard.setAttribute('class',"listing-card")
        listingCard.innerHTML=`
        <img src="${datas.images[0]}">
        <div class="listing-info">
            <h3>${datas.name}</h3>
            <p>${datas.type} · ${datas.beds} beds · ${datas.bathrooms} bathrooms</p>
            <p>${datas.price.total} per night</p>
            <p>${datas.address}</p>
            <p>Amenities: ${datas.previewAmenities.join(", ")}</p>
            <p>Reviews: ${datas.reviewsCount}  |  Average Rating: ${datas.rating}</p>
            <p style="color:red;">${isSuperHost(datas.isSuperhost)}</p>
            <p style="color:green;">${isRareFind(datas.rareFind)}</p>
            <button style="padding:5px; border:none; cursor:pointer;">Get Directions</button>
        </div>
        `
        searchlistingContainer.append(listingCard);
        const costButton = document.createElement("button");
        costButton.style.border='none';
        costButton.style.cursor='pointer'
        costButton.innerText = "Show Booking Cost Breakdown";
        costButton.addEventListener("click", (event) =>{
        event.stopPropagation();
         showBookingCostBreakdown(datas)});
        

        listingCard.appendChild(costButton);
        listingCard.addEventListener('click',()=>{
            
            // searchlistingContainer.style.display='none';
        //    window.location.href="./maps.html"
           const newWindow = window.open("./maps.html", '_blank');
          
          newWindow.onload=()=>{
            const newWindowDocument = newWindow.document;
            const mapSrc = `https://maps.google.com/maps?q=${datas.lat},${datas.lng}&hl=es;z=14&amp;output=embed`;

            const mapDiv = newWindowDocument.getElementById('map');
            mapDiv.innerHTML=`<iframe src="${mapSrc}"></iframe>`;
          }
       
        });
    });
} 

    function showBookingCostBreakdown(datas) {
        // Calculate additional fees and total cost
        // const additionalFees = datas.price * 0.10; // Assuming additional fees are 10% of base price
        // const totalCost = datas.price + additionalFees;
    
        // Create a modal dialog box
        const modal = document.createElement("div");
        modal.style.display = "block";
        modal.style.width = "300px";
        modal.style.height = "200px";
        modal.style.backgroundColor = "#fff";
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.padding = "20px";
        modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
     
        modal.innerHTML = `
            <h2>Booking Cost Breakdown</h2>
            <p>Base Rate: $${datas.price.priceItems[0].amount}</p>
            <p>Additional Fees: $${datas.price.priceItems[1].amount+datas.price.priceItems[2].amount}</p>
            <p>Total Cost: $${datas.price.total}</p>
        `;
    
        // Add a close button to the modal
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.addEventListener("click", () => modal.style.display = "none");
        modal.appendChild(closeButton);
    
        // Add the modal to the body
        document.body.appendChild(modal);
      
}

//function for superhost
function isSuperHost(data){
    var str="";
    if(data){
        str="Superhost";
    }
    return str;
}
//function for rare find
function isRareFind(data){
    var str="";
    if(data){
        str="Rare Find";
    }
    return str;
}

