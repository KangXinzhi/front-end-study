const deg = 6;
const hr = document.querySelector('#hour');
const mn = document.querySelector('#minute');
const sc = document.querySelector('#second');

setInterval(()=>{
    let day = new Date();
    let hh = day.getHours() * 30; //当前Hour
    let mm = day.getMinutes() * deg; //当前Minute
    let ss = day.getSeconds() * deg; //当前Second
    hr.style.transform = `rotateZ(${(hh)+(mm/12)}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;
});