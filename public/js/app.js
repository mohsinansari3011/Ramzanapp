var calenderBody = document.getElementById("calenderBody");
var todayTableEl = document.getElementById("today");



var months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var prayerNameEl = document.getElementById("prayer-name");
var remainingTimeEl = document.getElementById("remaining-time");

var nextPrayer;
var remainingTime;

var bottomBarEl = document.getElementById("bottom-bar");
var isRamzan = false;
var isDayPassed = false;


var brand = document.getElementById("brand");
var searchImg = document.getElementById("search-img");
var closeBtn = document.getElementById("close-btn");
var userInputEl = document.getElementById("user-input");
var inputGroup = document.querySelector('.input-group');


function fetchToday(){
    var int = setInterval(()=>{
        
        var today = new Date();
        var todayDate = `${today.getDate()} ${months[today.getMonth()]} 2018`;
        var todayObject;
        var tomorrowObject;
        var todaySeconds = (3600*today.getHours()) + (60 * today.getMinutes());
        var remainingDayTime;
        // Decide day
        for(var i = 0; i < prayersTiming.length; i++){
    
            if(prayersTiming[i].date.indexOf(todayDate) !== -1){
                todayObject = prayersTiming[i];
                tomorrowObject = prayersTiming[i+1];
                break;
            }
    
        }
    
    
        if( (today.getDate() >= 17 && today.getMonth() === 4) || (today.getDate() <= 15 && today.getMonth() === 5)){
            isRamzan = true;
        }
    
    
        if(isRamzan){
            
            for(var i = 0; i < ramzanCalender.length; i++){
                if(ramzanCalender[i].date.indexOf(todayDate) !== -1){
                    ramzanObject = ramzanCalender[i];
                    break;
                }
            }
            
            bottomBarEl.innerHTML = `
                <div class="text-left inner-div">Sehri ${ramzanObject.sehri}</div>
                <div class="text-right inner-div">Aftari ${ramzanObject.aftari}</div>
            `
            todayTableEl.innerHTML = `
                <tr>
                    <td>${today.getDate()} - ${months[today.getMonth()]}</td>
                    <td class="text-center">${ramzanObject.ramzan}</td>
                    <td>${days[today.getDay()]}</td>
                </tr>
            `;
    
        }
        else{
            
            bottomBarEl.innerText = `Ramzan is coming in ${17 - today.getDate()} days`;
            todayTableEl.innerHTML = `
                <tr>
                    <td>${today.getDate()} - ${months[today.getMonth()]}</td>
                    <td class="text-center">-</td>
                    <td>${days[today.getDay()]}</td>
                </tr>
            `;
        }
    

        // Decide next prayer
        
        // if data not found
        if(todayObject === undefined){
            nextPrayer = 'Data for this day not found';
            remainingTime = 'Data for this day not found';
            prayerNameEl.innerText = nextPrayer;
            remainingTimeEl.innerText = remainingTime;
            return false;  
        }
        // if data found
        if( todaySeconds < makePrayerTime(todayObject.fajar) ){
            nextPrayer = 'FAJAR';
            remainingTime = todayObject.fajar;
            // remainingTime = todayObject.fajar.seconds - todaySeconds;        
        }
        else if(todaySeconds < makePrayerTime(todayObject.zohar)){
            nextPrayer = 'ZOHAR';
            remainingTime = todayObject.zohar;
            
        }
        else if(todaySeconds < makePrayerTime(todayObject.asar)){
            nextPrayer = 'ASAR';
            remainingTime = todayObject.asar;            
        }
        else if(todaySeconds < makePrayerTime(todayObject.magrib)){
            nextPrayer = 'MAGRIB';
            remainingTime = todayObject.magrib;
        }
        else if(todaySeconds < makePrayerTime(todayObject.isha)){
            nextPrayer = 'ISHA';
            remainingTime = todayObject.isha;            
        }
        else{
            isDayPassed = true;
            var ishaTime = makePrayerTime(todayObject.isha);
            remainingDayTime = 86400 - todaySeconds;
            
            nextPrayer = 'FAJAR';
            remainingTime = tomorrowObject.fajar;
                      
        }

        var prayerTime = makePrayerTime(remainingTime);
        
        if(isDayPassed){
            remainingTime = remainingDayTime + prayerTime;
        }else{
            remainingTime = prayerTime - todaySeconds;
        }
        remainingTime = makeTime(remainingTime);
        prayerNameEl.innerText = nextPrayer;
        remainingTimeEl.innerHTML = remainingTime;
         
    },1000);
}




//Convert seconds to hours and minutes
function makeTime(seconds){
    //console.log(seconds);
    seconds = ((seconds/60)/60);
    var TimeArr = (seconds).toString().split('.');
    var hours = parseInt(TimeArr[0]);
    var minutes = parseFloat('.' + TimeArr[1]);
    return hours + ' <small>hr</small> ' + Math.round(minutes*60) + ' <small>min</small>';
}

// Calculate seconds of prayers time
function makePrayerTime(prayerTime){
    prayerTime = (prayerTime.toString()).split(":")
    var firstPart = parseInt(prayerTime[0]);
    var secondPart = parseInt(prayerTime[1]);
    return (firstPart*3600) + (secondPart*60);
}

function fetchcalender(){
    var today = new Date();
    var todayDate = `${today.getDate()} ${months[today.getMonth()]} 2018`;
    var index;
    var tr;
    for (var  i = 0; i < ramzanCalender.length; i++){
        calenderBody.innerHTML += `
            <tr>
                <td>${ramzanCalender[i].ramzan}</td>
                <td>${ramzanCalender[i].date}</td>
                <td>${ramzanCalender[i].day}</td>
                <td>${ramzanCalender[i].sehri}</td>
                <td>${ramzanCalender[i].aftari}</td>                
            </tr>
        `
    }
    tr = calenderBody.getElementsByTagName('tr');
    if((today.getDate() >= 17 && today.getMonth() === 4) || (today.getDate() <= 15 && today.getMonth() === 5)){
        
        for(var i = 0; i < ramzanCalender.length; i++){
            if(ramzanCalender[i].date.indexOf(todayDate) !== -1){
                index = i;
                break;
            }
        }
        for(var i=0; i < index; i++){
           tr[i].style.opacity = '0.7';            
           tr[i].style.backgroundColor = '#8395a7';
        }
        tr[index].style.backgroundColor = '#3C3C3D';
        tr[index].style.color = '#fff';
    }
}





if (searchImg) {

    searchImg.addEventListener("click",()=>{
    brand.style.display = 'none';
    searchImg.style.display = 'none';
    inputGroup.style.display = 'flex';
});

}

if (closeBtn) {
closeBtn.addEventListener("click",()=>{
    brand.style.display = 'block';
    searchImg.style.display = 'block';
    inputGroup.style.display = 'none';

});
}

if (userInputEl) {
userInputEl.addEventListener("keyup",()=>{
    var userInput = userInputEl.value;
    var index;
    var tr;
    tr = calenderBody.getElementsByTagName('tr');
    
    for(var i=0; i<ramzanCalender.length; i++){
        if(userInput === ramzanCalender[i].ramzan){ 
            index = i;
            break;
        }
    }
    
    for(var i=0 ; i<tr.length; i++){
        if(i === index){
            tr[i].style.display = 'table-row';            
            continue;
        }
        tr[i].style.display = 'none';
    }
    if(userInput === ''){
        for(var i=0 ; i<tr.length; i++){
            tr[i].style.display = 'table-row';
        } 
    }
});
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('../service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
}