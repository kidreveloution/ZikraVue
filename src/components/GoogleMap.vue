

<template>

  <div id="map" style="width: 100%; height: 100vh;"></div>
  <div id="memoryBoxTitle">
    <h2 style="font-family: Arial, sans-serif; font-size: 12px; text-decoration: underline; color: blue; text-align: center;">More Memories on this date</h2>
    </div>
  <div id="memoryBox" class="memoryBox">
      <table id="memoryTable">
        <!-- Dynamic rows will be added here -->
    </table>
</div>
</template>
  
  <script>

  /* global google */
  import $ from 'jquery';


  export default {
    name: 'GoogleMap',
    mounted() {
      this.initMap();
    },
    setup() {
        return {
            map: null,
            markersArray: []
        }
    },
    computed:{
        watch_date () {
            return this.$store.state.showDate.showDate
        },
    },
    watch:
    {
        watch_date(newDate){
            this.hideMarkers()
            this.showAllMemories(newDate)
        }
    },
    methods: {
      initMap() {
        // Check if the Google Maps script is already loaded
        if (typeof google === 'undefined') {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=`+process.env.VUE_APP_GOOGLE_MAPS_KEY+`&callback=initMap`;
          script.async = true;
          script.defer = true;
          window.initMap = this.loadMap;
          document.head.appendChild(script);
        } else {
          // If Google Maps is already loaded, directly call loadMap
          this.loadMap();
        }
      },
      loadMap() {  
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          mapId: 'bc55fc2e7ebbdda0',
          center: { lat: 31.476737, lng: 34.4813380 }, 
          streetViewControl: false,
          disableDefaultUI: false});

          google.maps.event.addListener(this.map, 'idle', this.updatePikadayWithNewEvents);
      },
      _getBounds() {
        return new Promise((resolve, reject) => {
          if (this.map) {
            if (this.map.getBounds()) {
              // If bounds are already available, resolve immediately
              const bounds = this.map.getBounds();
              this.$store.dispatch('mapBounds/setBounds', bounds); // Dispatch action
              resolve(bounds);
            } else {
              // Wait for the 'idle' event if bounds are not available
              google.maps.event.addListenerOnce(this.map, 'idle', () => {
                const bounds = this.map.getBounds();
                this.$store.dispatch('mapBounds/setBounds', bounds); // Dispatch action
                resolve(bounds);
              });
            }
          } else {
            reject(new Error("Map is not initialized"));
          }
        });
      },
      updatePikadayWithNewEvents() {
        this._getBounds()

      },
      showAllMemories(timestamp) {
        this.clearTableRows('memoryTable');

        var dataStruct = {
            "timestamp": timestamp,
        };

        $.ajax({
            url: process.env.VUE_APP_ZIKRA_API_SHOW_ALL_MEM,
            headers:{
                    "zikra_main":process.env.VUE_APP_ZIKRA_API_KEY
            },
            type: "GET",
            data: dataStruct,
            success: (res) => { // Changed to arrow function
                this._populateMemories(res);
            }
        });
      },
      async _populateMemories(res) {
        var memory;
        var is_precise_flag;
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        // Google Maps API not loaded yet, wait for a bit and then try again
            setTimeout(() => this._populateMemories(res), 1000); // Wait for 1 second before retrying
            return;
        }
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        res = JSON.parse(res)
        for (memory in res) {
            is_precise_flag = res[memory][0]['is_precise']
            
            if (is_precise_flag == "false"){ // These memories need to go into memory box, and thats it
              this._populateMemoryBox(res[memory])
              
            }else{
              if (res[memory].length > 1) {
                  var sharedObject = this._formatSharedMemories(res[memory])
                  this.createSharedMemoryMarker(sharedObject)
              } else {
                      const markerElement = new AdvancedMarkerElement({
                      map: this.map,
                      content: this.buildContent(res[memory][0]),
                      position: new google.maps.LatLng(res[memory][0]["lat"], res[memory][0]["lon"]),
                      title: res[memory]["title"],
                  });
                  this.markersArray.push(markerElement);

                  markerElement.addListener("click", () => {
                      this.toggleHighlight(markerElement); // Assuming toggleHighlight is a method of the component
                  });
              }
            }
        }
      },
      buildContent(memory) {
        const content = document.createElement("div");
        content.style.borderColor = "#d32121"; // Set the border color
        content.style.borderWidth = "2px"; // Set the border width
        content.style.borderStyle = "solid"; // Set the border style
        content.classList.add("property");
        content.innerHTML = `
          <div class="icon">
              <i aria-hidden="true" class="fa-solid ${memory["icon"]}" title="${memory["title"]}"></i>
          </div>
            <div class="details">
                <div class="price">${memory.title}</div>
                <div class="address">${memory.descx}</div>
                <div class="features">
                <div>
                  <a href="${memory.link}" target="_blank">
                    <i aria-hidden="true" class="fa fa-link fa-lg link" title="bedroom"></i>
                    <span class="fa-sr-only">bedroom</span>
                    <span>View Memory</span>
                    </a>
                </div>
              </div>
            `;
        return content;
      },
      toggleHighlight(markerView) {
        if (markerView.content.classList.contains("highlight")) {
          markerView.content.classList.remove("highlight");
          markerView.zIndex = null;
        } else {
          markerView.content.classList.add("highlight");
          markerView.zIndex = 1;
        }
      },
      setMapOnAll(map) {
        for (let i = 0; i < this.markersArray.length; i++) {
          this.markersArray[i].setMap(map);
        }
      },
      hideMarkers() {
        this.setMapOnAll(null);
      },
      buildSharedContent(memories){
        const content = document.createElement("div");

        content.style.borderColor = "#d32121"; // Set the border color
        content.style.borderWidth = "2px"; // Set the border width
        content.style.borderStyle = "solid"; // Set the border style
        content.classList.add("property");
        var linkContent = this.buildLinks(memories["links"])
        content.innerHTML = `
          <div class="icon">
              <i aria-hidden="true" class="fa-solid ${memories["icon"]}" title="${memories["title"]}"></i>
          </div>
            <div class="details" >
                <div class="price">${memories.title}</div>
                <div class="address">${memories.titles}</div>
                <div class="features">${linkContent}</div>
            </div>
          </div>     
            `;
        return content;

      },
      buildLinks(links){
        // Assuming memories.links is an array of URLs

        // Initialize an empty string to hold the HTML
        let htmlContent = '';

        // Iterate over each link and append the HTML string for each link
        links.forEach(link => {
            htmlContent += `
            <div style="display: inline-block; padding: 10px; margin-right: 10px;">
                    <a href="${link}" target="_blank">
                        <i aria-hidden="true" class="fa fa-link fa-lg link" title="bedroom"></i>
                        <span class="fa-sr-only">bedroom</span>
                        <span>View Memory</span>
                    </a>
                </div>
            `;
        });

        return htmlContent;
      },
      _formatSharedMemories(sharedMemory){
          var titles=[]
          var memory
          var links=[]
          var ids=[]
          var icon='fa-solid fa-user-group'
          for (memory in sharedMemory){
              titles.push(sharedMemory[memory]["title"])
              links.push(sharedMemory[memory]["link"])
              ids.push(sharedMemory[memory]["id"])
          }

          var retunedObject = {
              "icon": icon,
              "title": "Shared Memories in "+sharedMemory[0]["location"],
              "titles": titles,
              "links": links,
              "ids": ids,
              "lat": sharedMemory[0]["lat"],
              "lon": sharedMemory[0]["lon"],
              "timestamp": sharedMemory[0]["timestamp"],
          }
          return retunedObject

      },
      createSharedMemoryMarker(sharedObject){
        const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
                map: this.map,
                content: this.buildSharedContent(sharedObject),
                position: { lat: sharedObject["lat"], lng: sharedObject["lon"] },
                title: sharedObject["title"],
            })
            this.markersArray.push(AdvancedMarkerElement)

            AdvancedMarkerElement.addListener("click", () => {
            this.toggleHighlight(AdvancedMarkerElement);
            });

      },
      _populateMemoryBox(memory) {
    var table = document.getElementById("memoryTable");
    
    var newRow = table.insertRow(-1); // Add the row at the end of the table
    var newCell = newRow.insertCell(0); // Add a new cell to the row

    // Create a container div inside the cell for better control of layout
    const containerDiv = document.createElement("div");
    containerDiv.className = "memory-container";

    containerDiv.innerHTML = `
        <div class="icon">
            <i aria-hidden="true" title="${memory[0]["title"]}"></i>
            <div class="smaller-font">
              <div class="title"><strong>${memory[0].title}</strong></div>
              <div class="description">${memory[0].descx}</div>
              <div class="features">
                  <a href="${memory[0].link}" target="_blank">
                      <i aria-hidden="true" class="fa fa-link fa-lg link"></i>
                      <span>View Memory</span>
                  </a>
              </div>
          </div>

    `;

    newCell.appendChild(containerDiv);
      },
      clearTableRows(tableId) {
        var table = document.getElementById(tableId);
        if (!table) {
            return;
        }

        // Loop to remove each row from the table
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
      }
    }
  }

  </script>
  
  <style>
  .smaller-font {
    font-size: small; /* Or any specific size you prefer */
  }

  #memoryBox {
    border: 2px solid lightblue;
    background-color: white;
    padding: 20px;
    width: 10%;
    margin: 20px auto;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

    display: flex;
    position: absolute;
    top: 110px;
    /* Adjust as needed to place it at the desired location on the map */
    right: 10px;
    /* Adjust as needed */
    z-index: 10;
    /* Ensures it appears above the map */
    font-family: 'Arial', sans-serif;
  }
  #memoryBoxTitle {
    border: 2px solid lightblue;
    background-color: white;
    padding: 20px;
    width: 10%;
    margin: 10px auto;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

    position: absolute;
    top: 50px;
    /* Adjust as needed to place it at the desired location on the map */
    right: 10px;
    /* Adjust as needed */
    z-index: 11;
    /* Ensures it appears above the map */
    font-family: 'Arial', sans-serif;
    font-size: 200px;
  }


  #memoryTable tr:nth-child(even) {
      background-color: #f2f2f2;
  }

  #memoryTable tr:hover {
      background-color: #ddd;
  }



  :root {
  --building-color: #FF9800;
  --house-color: #0288D1;
  --shop-color: #7B1FA2;
  --warehouse-color: #558B2F;
}

/*
 * Optional: Makes the sample page fill the window.
 */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

/*
 * Always set the map height explicitly to define the size of the div element
 * that contains the map.
 */
#map {
  height: 100%;
  width: 100%;
}

/*
 * Property styles in unhighlighted state.
 */
.property {
  align-items: center;
  background-color: #ffffff;
  border-radius: 50%;
  color: #3a3a3a;
  display: flex;
  font-size: 14px;
  gap: 15px;
  height: 30px;
  justify-content: center;
  padding: 4px;
  position: relative;
  position: relative;
  transition: all 0.3s ease-out;
  width: 30px;
}

.property::after {
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: 9px solid #c55858;
  content: "";
  height: 0;
  left: 50%;
  position: absolute;
  top: 95%;
  transform: translate(-50%, 0);
  transition: all 0.3s ease-out;
  width: 0;
  z-index: 1;
}

.property .icon {
  align-items: center;
  display: flex;
  justify-content: center;
  color: #d32121;
}

.property .icon svg {
  height: 20px;
  width: auto;
}

.property .details {
  display: none;
  flex-direction: column;
  flex: 1;
}

.property .address {
  color: #9E9E9E;
  font-size: 10px;
  margin-bottom: 10px;
  margin-top: 5px;
}

.property .features {
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.property .features > div {
  align-items: center;
  background: #F5F5F5;
  border-radius: 5px;
  border: 1px solid #ccc;
  display: flex;
  font-size: 10px;
  gap: 5px;
  padding: 5px;
}

/*
 * Property styles in highlighted state.
 */
 
.property.highlight {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.2);
  height: 80px;
  padding: 8px 15px;
  width: auto;
}

.property.highlight::after {
  border-top: 9px solid #FFFFFF;
}

.property.highlight .details {
  display: flex;
}

.property.highlight .icon svg {
  width: 50px;
  height: 50px;
}

.property .bed {
  color: #FFA000;
}

.property .bath {
  color: #03A9F4;
}

.property .size {
  color: #388E3C;
}

/* Generic icon colors */
.property.highlight:has(.icon-class) .icon {
  color: var(--icon-color);
}

.property:not(.highlight):has(.icon-class) {
  background-color: var(--icon-color);
}

.property:not(.highlight):has(.icon-class)::after {
  border-top: 9px solid var(--icon-color);
}


/*
 * House icon colors.
 */
.property.highlight:has(.fa-house) .icon {
  color: var(--house-color);
}

.property:not(.highlight):has(.fa-house) {
  background-color: var(--house-color);
}

.property:not(.highlight):has(.fa-house)::after {
  border-top: 9px solid var(--house-color);
}

/*
 * Building icon colors.
 */
.property.highlight:has(.fa-building) .icon {
  color: var(--building-color);
}

.property:not(.highlight):has(.fa-building) {
  background-color: var(--building-color);
}

.property:not(.highlight):has(.fa-building)::after {
  border-top: 9px solid var(--building-color);
}

/*
 * Warehouse icon colors.
 */
.property.highlight:has(.fa-warehouse) .icon {
  color: var(--warehouse-color);
}

.property:not(.highlight):has(.fa-warehouse) {
  background-color: var(--warehouse-color);
}

.property:not(.highlight):has(.fa-warehouse)::after {
  border-top: 9px solid var(--warehouse-color);
}

/*
 * Shop icon colors.
 */
.property.highlight:has(.fa-shop) .icon {
  color: var(--shop-color);
}

.property:not(.highlight):has(.fa-shop) {
  background-color: var(--shop-color);
}

.property:not(.highlight):has(.fa-shop)::after {
  border-top: 9px solid var(--shop-color);
}

  </style>
  