let allezflights = []
let retourflights = []

const setAllezflights = (data)=>{
    allezflights = data;
}

const setRetourFlights = (data) => {
     retourflights = data;
}

const displayAllezFlights = (pnum) => {
    const allezflightTable = document.querySelector('#allez-table');

    let allezflightsHTML="";
 
    // allezflights.map( allezflight => {
    //     allezflightsHTML += `<tr><td><input type="radio" value="${allezflight.flight_id}"  name="flight-allez"></td>
    //     <td>departing from ${allezflight.departure_airport} at ${allezflight.scheduled_departure}             arrivig at ${allezflight.arrival_airport} at ${allezflight.scheduled_arrival} </td></tr>`
    // });

     
    allezflights.map( allezflight => {
        allezflightsHTML += `<td>departing from ${allezflight.departure_city}-${allezflight.departure_airport} at ${allezflight.scheduled_departure}             arrivig at${allezflight.arrival_city} ${allezflight.arrival_airport} at ${allezflight.scheduled_arrival} </td> <td> For $ ${allezflight.price} per passenger</td>
        <td><button type="button" onclick="selectAllezFlight(${allezflight.flight_id}, ${allezflight.price}, ${pnum})">Select</button></td></tr>`
    });

    allezflightTable.innerHTML = allezflightsHTML;

    const retourflightTable = document.querySelector('#retour-table');


    let retourflightHTML="";

    // retourflights.map( retourflight => {
    //      retourflightHTML += `<tr><td><input type="radio" value="${retourflight.flight_id}" name="flight-retour"></td>
    //      <td>departing from ${retourflight.departure_airport} at ${retourflight.scheduled_departure}             arrivig at ${retourflight.arrival_airport} at ${retourflight.scheduled_arrival} </td></tr>`

    // })

    retourflights.map( retourflight => {
        retourflightHTML += `<tr><td>departing from${retourflight.departure_city} - ${retourflight.departure_airport} at ${retourflight.scheduled_departure}             arrivig at${retourflight.arrival_city} - ${retourflight.arrival_airport} at ${retourflight.scheduled_arrival} </td><td> For $ ${retourflight.price} per passenger </td>
        <td><button type="button" onclick="selectRetourFlight(${retourflight.flight_id}, ${retourflight.price}, ${pnum})">Select</button></tr>`
    })


    retourflightTable.innerHTML = retourflightHTML;

    const flight_allez = document.getElementsByName("flight-allez").value;
    const flight_retour = document.getElementsByName("flight-retour").value;

    const subBut = document.querySelector("#submitflights");

    let subHtml = `<button type="button" onclick="location.href='./passenger_info.html'"> Book these Flights</button>`;

    subBut.innerHTML = subHtml;

}

async function searchFlight(){
    try{
        const depart_city = document.getElementById('depart').value;
        const arrive_city = document.getElementById('arrive').value;
        const p_num =  document.getElementById('p_num').value;
        const allez= depart_city.concat("&", arrive_city);
      
        const retour = arrive_city.concat("&", depart_city);
       
        const response1 = await fetch(`http://localhost:5000/flights/${allez}`);
        console.log(response1);
        const jsonData1 = await response1.json();
        setAllezflights(jsonData1);

        const response2 = await fetch(`http://localhost:5000/flights/${retour}`);
        console.log(response2);
        const jsonData2 = await response2.json();
        setRetourFlights(jsonData2);

        console.log(p_num);

        displayAllezFlights(p_num);
       
    }
    catch(e){
        console.log(e);
    }
}
