
// TOOD - make icons svg legend



import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';
import Vivus from 'vivus';
import moment from 'moment';

const setSvgAttr = (element, attr, value) => {
  return element.setAttribute(attr, value);
};

const gA = (el, attr) => {
  return el.getAttribute(attr);
};

const customColors = {
  primary: '#aa2d12',
  secondary: '#646464',
  info: '#c88b00',
  light: '#f3ece0',
};

const utoky = Array.from(document.getElementsByTagName('circle'));
const hranice = Array.from(document.getElementById('merged_hranice_shapefile').children);
const zeleznice = Array.from(document.getElementById('zeleznice').children);
const btn_zel_start = document.getElementById('start-anim')
const btn_zel_stop = document.getElementById('stop-anim')
const btn_zel_reset = document.getElementById('reset-anim')






  zeleznice.forEach(rail => {
    let attackedStatus = gA(rail, 'data-attacked_i');
    if (attackedStatus !== 'null') {
      setSvgAttr(rail, 'stroke', customColors.primary);
    }
    else {
      setSvgAttr(rail, 'data-ignore', true)
      setSvgAttr(rail, 'stroke-width', '0.5px')
    }
  });
  
  // animate zeleznice
  const animZeleznice =  new Vivus('zeleznice',{
  type: 'oneByOne',
  duration: 500});
  animZeleznice.stop()
  
  btn_zel_start.onclick = () => {
   animZeleznice.play()
  }
  
  btn_zel_stop.onclick = () => {
    animZeleznice.stop()
  }
  
  btn_zel_reset.onclick = () => {
    animZeleznice.reset()
  } 


  const resolvePointColor = (catString) => {
    let color = ''
    if (catString === 'přepadení') {
      color = '#df0c01'
    }
    if (catString === 'nálož') {
      color = '#e88b00'
    }
    if (catString === 'narušení kolejí'){
      color = '#905900'
    }
    if (catString === 'překážka na trati'){
      color = '#050505'
    }
  
    return color
      
  }
  

const btn_utok_start = document.getElementById('start-anim-u')
const btn_utok_stop = document.getElementById('stop-anim-u')
const btn_utok_reset = document.getElementById('reset-anim-u')
const display_text = document.getElementById('i-year')

function prepareUtoky(utoky_dates_arr) {  
  utoky.forEach(utok => {
  setSvgAttr(utok, 'r', '4')
  setSvgAttr(utok, 'stroke', 'black')
  setSvgAttr(utok, 'stroke-width', '0.5')
  setSvgAttr(utok, 'fill', resolvePointColor(gA(utok, 'data-kateogorie')))
  setSvgAttr(utok, 'opacity', '0')

  let date_string = gA(utok, 'data-date_s')
  utoky_dates_arr.push(moment(date_string)) 
})
}

const modUtoky = (next_date) => {
  utoky.forEach( utok => {
    let next_date_str = next_date.format('YYYY-MM-DD')
    if (next_date_str === gA(utok, 'data-date_s')){
      setSvgAttr(utok, 'opacity', '1')
    }
  });
}

const timeIncrementation = (new_date) => {
  let incremented_date = new_date
  return moment(incremented_date).add(1, new_date.isBefore('1944-03-18') ? 'M': 'd')
}




const runTime = (curr_date) => {
  const last_utok = utoky_dates_arr[utoky_dates_arr.length - 1]
  display_text.innerHTML = curr_date.format('D.M.YYYY')
  if (curr_date.isBefore(last_utok, 'day')){
    modUtoky(curr_date)
    let next_date = timeIncrementation(curr_date)
    gCurrDate = next_date
    timeId = setTimeout(() => {runTime(next_date)}, next_date.isBefore('1945-01-01') ? 50 : 200)
    timids.push(timeId)
  }
    else{
      runTime(last_utok)
    }
    
  }

  
  
  const checkIfRunning = () => {
    if (timeId !== undefined) {
      for (const id of timids) {
        clearTimeout(id)
      }
    }
  }
  

  const stop = () => {
    stoppedId = true
    checkIfRunning()
  }
  
  const reset = () => {
    checkIfRunning()
    utoky.forEach(el => {
      setSvgAttr(el, 'opacity', '0')
      });
      display_text.innerHTML = 'Datum'
      gCurrDate = undefined
      stoppedId = false
    }

    
    
    btn_utok_start.onclick = () => {
      // console.log(` stopped id ${stoppedId}, timeid ${timeId}, gcur ${gCurrDate}`);
      if (gCurrDate === undefined) {
        const start_date = utoky_dates_arr[0]
        let new_date = start_date
        reset()
        runTime(new_date)}
        if (stoppedId) {
          runTime(gCurrDate)
          stoppedId = false
        }
      }
      
      btn_utok_reset.onclick = () => {
        reset()
      }
      
      btn_utok_stop.onclick = () => {
        stop()
      }
      
      
      
    const timids = []
    const utoky_dates_arr = []
    let stoppedId = false
    let timeId = undefined
    let gCurrDate = undefined
    prepareUtoky(utoky_dates_arr)




    