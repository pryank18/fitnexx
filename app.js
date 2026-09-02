(function(){
  "use strict";
  var SETS_KEY = 'fitnexx_sets_v1';
  var PROGRAM_KEY = 'fitnexx_program_v1';
  var LIFTS = ['Back squat','Bench press','Deadlift','Overhead press'];
  var PROGRAMS = [
    {id:'strength', name:'Strength', desc:'4 sessions / week heavy compound lifts'},
    {id:'conditioning', name:'Conditioning', desc:'3 sessions / week interval-based'},
    {id:'mobility', name:'Mobility', desc:'Daily joint-by-joint range work'},
    {id:'hybrid', name:'Hybrid', desc:'5 sessions / week strength + conditioning'}
    ];
  function loadSets(){
    try{
      var raw = localStorage.getItem(SETS_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function saveSets(sets){
    try{ localStorage.setItem(SETS_KEY, JSON.stringify(sets)); }catch(e){}
  }
  function loadProgram(){
    try{ return localStorage.getItem(PROGRAM_KEY) || null; }catch(e){ return null; }
  }
  function saveProgram(id){
    try{ localStorage.setItem(PROGRAM_KEY, id); }catch(e){}
  }
  function epley(weight, reps){
    return weight * (1 + reps/30);
  }
  function fmtDate(iso){
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'});
  }
  function todayISO(){
    return new Date().toISOString().slice(0,10);
  }
  function uid(){
    return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }
  function computeBestEstimate(lift, sets){
    var best = 0;
    sets.forEach(function(s){
      if(s.lift === lift){
        var e = epley(s.weight, s.reps);
        if(e > best) best = e;
      }
    });
    return best;
  }
  function computeStreak(sets){
    if(sets.length === 0) return 0;
    var days = {};
    sets.forEach(function(s){ days[s.date] = true; });
    var streak = 0;
    var cursor = new Date();
    cursor.setHours(0,0,0,0);
    if(!days[cursor.toISOString().slice(0,10)]){
      cursor.setDate(cursor.getDate() - 1);
    }
    while(true){
      var iso = cursor.toISOString().slice(0,10);
      if(days[iso]){
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }
  function initDashboard(){
    var cardsEl = document.getElementById('dash-stat-cards');
    if(!cardsEl) return;
    var recentEl = document.getElementById('dash-recent');
    var sets = loadSets();
    var program = loadProgram();
    var totalSets = sets.length;
    var streak = computeStreak(sets);
    var programObj = PROGRAMS.filter(function(p){ return p.id === program; })[0];
    var topLiftEstimate = 0, topLiftName = '-';
    LIFTS.forEach(function(l){
      var e = computeBestEstimate(l, sets);
      if(e > topLiftEstimate){ topLiftEstimate = e; topLiftName = l; }
    });
  
  cardsEl.innerHTML =
    '<div class="stat-card"><div class="num">' + totalSets + '</div><div class="lbl">Sets logged</div></div>' +
    '<div class="stat-card"><div class="num">' + streak + '</div><div class="lbl">Day streak</div></div>' +
    '<div class="stat-card"><div class="num">' + (topLiftEstimate ? Math.round(topLiftEstimate) + ' kg' : '-') + '</div><div class="lbl">' + (topLiftEstimate ? 'Best est. 1RM ' + topLiftName : 'No lifts logged yet') + '</div></div>' +
    '<div class="stat-card"><div class="num" style="font-size:22px;">' + (programObj ? programObj.name : 'None set') + '</div><div class="lbl">Active program</div></div>';
    if(sets.length === 0){
      recentEl.innerHTML = '<div class="empty-state"><strong>Nothing logged yet</strong>Head to Log workout and add your first set - it takes about ten seconds.</div>';
      return;
    }
    var sorted = sets.slice().sort(function(a,b){ return b.date.localeCompare(a.date) || b.id.localeCompare(a.id); }).slice(0,6);
    var html = '<ul class="activity-list">';
    sorted.forEach(function(s){
      html += '<li><span class="a-lift">' + s.lift + '</span><span class="a-meta">' + s.weight + ' kg x ' + s.reps + ' - ' + fmtDate(s.date) + '</span></li>';
    });
    html += '</ul>';
    recentEl.innerHTML = html;
  }

 function renderLog(){
   var wrap = document.getElementById('log-table-wrap');
   if(!wrap) return;
   var sets = loadSets().slice().sort(function(a,b){ return b.date.localeCompare(a.date) || b.id.localeCompare(a.id); });
   if(sets.length === 0){
     wrap.innerHTML = '<div class="empty-state"><strong>No sets yet</strong>Use the form above - every set you add shows up here and feeds your dashboard and progress charts.</div>';
     return;
   }
   var html = '<table class="log-table"><thead><tr><th>Lift</th><th>Weight</th><th>Reps</th><th>Est. 1RM</th><th>Date</th><th></th></tr></thead><tbody>';
   sets.forEach(function(s){
     html += '<tr><td>' + s.lift + '</td><td>' + s.weight + ' kg</td><td>' + s.reps + '</td><td>' + Math.round(epley(s.weight,s.reps)) + ' kg</td><td>' + fmtDate(s.date) + '</td><td><button class="del-btn" data-del="' + s.id + '">Remove</button></td></tr>';
   });
   html += '</tbody></table>';
   wrap.innerHTML = html;
   wrap.querySelectorAll('.del-btn').forEach(function(btn){
     btn.addEventListener('click', function(){
       var id = btn.getAttribute('data-del');
       var remaining = loadSets().filter(function(s){ return s.id !== id; });
       saveSets(remaining);
       renderLog();
     });
   });
 }

 function initLogForm(){
   var logForm = document.getElementById('log-form');
   if(!logForm) return;
   var logDateInput = document.getElementById('log-date');
   logDateInput.value = logDateInput.value || todayISO();
   logForm.addEventListener('submit', function(ev){
     ev.preventDefault();
     var lift = document.getElementById('log-lift').value;
     var weight = parseFloat(document.getElementById('log-weight').value);
     var reps = parseInt(document.getElementById('log-reps').value, 10);
     var date = logDateInput.value || todayISO();
     if(!weight || !reps || weight <= 0 || reps <= 0) return;
     var sets = loadSets();
     sets.push({id: uid(), lift: lift, weight: weight, reps: reps, date: date});
     saveSets(sets);
     document.getElementById('log-weight').value = '';
     document.getElementById('log-reps').value = '';
     renderLog();
   });
   renderLog();
 }

var currentProgressLift = LIFTS[0];
  function buildLineChartSVG(points){
    var w = Math.max(560, points.length * 90);
    var h = 260;
    var padL = 46, padR = 20, padT = 20, padB = 34;
    var minVal = Math.min.apply(null, points.map(function(p){ return p.val; }));
    var maxVal = Math.max.apply(null, points.map(function(p){ return p.val; }));
    if(minVal === maxVal){ minVal -= 5; maxVal += 5; }
    var range = maxVal - minVal;
    var xStep = (w - padL - padR) / (points.length - 1);
    function xAt(i){ return padL + i * xStep; }
    function yAt(v){ return padT + (1 - (v - minVal)/range) * (h - padT - padB); }
    var pathD = points.map(function(p,i){
      return (i === 0 ? 'M' : 'L') + xAt(i).toFixed(1) + ',' + yAt(p.val).toFixed(1);
    }).join(' ');
    var gridLines = '';
    var steps = 4;
    for(var i=0;i<=steps;i++){
      var v = minVal + (range * i/steps);
      var y = yAt(v);
      gridLines += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w-padR) + '" y2="' + y.toFixed(1) + '" stroke="var(--hair)" stroke-width="1"/>';
      gridLines += '<text x="4" y="' + (y+4).toFixed(1) + '" class="chart-point-label">' + Math.round(v) + '</text>';
    }
    var dots = points.map(function(p,i){
      return '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(p.val).toFixed(1) + '" r="4" fill="var(--ink)"/>' +
        '<text x="' + xAt(i).toFixed(1) + '" y="' + (h-10) + '" text-anchor="middle" class="chart-point-label">' + fmtDate(p.date) + '</text>';
    }).join('');
    var lastLabel = '<text x="' + xAt(points.length-1).toFixed(1) + '" y="' + (yAt(points[points.length-1].val)-12).toFixed(1) + '" text-anchor="middle" font-family="Bebas Neue" font-size="16" fill="var(--ink)">' + Math.round(points[points.length-1].val) + ' kg</text>';
    return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
      gridLines +
      '<path d="' + pathD + '" fill="none" stroke="var(--volt)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="' + pathD + '" fill="none" stroke="var(--ink)" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/>' +
      dots + lastLabel +
      '</svg>';
  }

  function renderProgress(){
    var chipsEl = document.getElementById('progress-lift-chips');
    if(!chipsEl) return;
    chipsEl.innerHTML = '';
    LIFTS.forEach(function(l){
      var chip = document.createElement('button');
      chip.className = 'lift-chip' + (l === currentProgressLift ? ' active' : '');
      chip.textContent = l;
      chip.type = 'button';
      chip.addEventListener('click', function(){
        currentProgressLift = l;
        renderProgress();
      });
      chipsEl.appendChild(chip);
    });
    var sets = loadSets()
    .filter(function(s){ return s.lift === currentProgressLift; })
    .sort(function(a,b){ return a.date.localeCompare(b.date); });
    var chartWrap = document.getElementById('progress-chart-wrap');
    if(sets.length < 2){
      chartWrap.innerHTML = '<div class="empty-state"><strong>Not enough data yet</strong>Log at least two ' + currentProgressLift.toLowerCase() + ' sets on different dates to see a trend line.</div>';
      return;
    }
    var points = sets.map(function(s){ return {date: s.date, val: epley(s.weight, s.reps)}; });
    chartWrap.innerHTML = buildLineChartSVG(points);
  }

  function renderPrograms(){
    var listEl = document.getElementById('program-list');
    if(!listEl) return;
    var active = loadProgram();
    var html = '';
    PROGRAMS.forEach(function(p){
      var isActive = p.id === active;
      html += '<div class="program-row"><div><h4>' + p.name + '</h4><p>' + p.desc + '</p></div>' +
        '<button class="program-set-btn' + (isActive ? ' is-active' : '') + '" data-program="' + p.id + '">' + (isActive ? 'Active' : 'Set as active') + '</button></div>';
    });
    listEl.innerHTML = html;
    listEl.querySelectorAll('.program-set-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        saveProgram(btn.getAttribute('data-program'));
        renderPrograms();
        initDashboard();
      });
    });
  }

  function initCalculator(){
    var weightInput = document.getElementById('calc-weight');
    if(!weightInput) return;
    var unit = 'kg';
    var kgBtn = document.getElementById('unit-kg');
    var lbBtn = document.getElementById('unit-lb');
    var repsInput = document.getElementById('calc-reps');
    var liftSelect = document.getElementById('calc-lift');
    var onermOut = document.getElementById('onerm-out');
    var onermNote = document.getElementById('onerm-note');
    var liftLabel = document.getElementById('rm-lift-label');
    var pctRows = document.querySelectorAll('#pct-body tr');
    var saveBtn = document.getElementById('calc-save-btn');
    var saveConfirm = document.getElementById('calc-save-confirm');
    var pcts = [0.95, 0.85, 0.75, 0.65];
    function setUnit(u){
      unit = u;
      kgBtn.classList.toggle('active', u === 'kg');
      lbBtn.classList.toggle('active', u === 'lb');
      calcCalculate();
    }
    kgBtn.addEventListener('click', function(){ setUnit('kg'); });
    lbBtn.addEventListener('click', function(){ setUnit('lb'); });
    function calcCalculate(){
      var w = parseFloat(weightInput.value);
      var r = parseInt(repsInput.value, 10);
      var lift = liftSelect.value;
      liftLabel.textContent = lift.toUpperCase() + ' - ESTIMATED 1RM';
      saveConfirm.textContent = '';
      if(!w || !r || w <= 0 || r <= 0){
        onermOut.textContent = '- ' + unit;
        onermNote.textContent = 'Enter a weight and rep count to calculate.';
        pctRows.forEach(function(row){ row.querySelector('.wt').textContent = '-'; });
        saveBtn.disabled = true;
        return;
      }
      if(r > 12){
        onermNote.textContent = 'Estimates get unreliable above ~12 reps. Try a heavier, lower-rep set for a tighter number.';
      } else {
        onermNote.textContent = 'Based on ' + w + ' ' + unit + ' for ' + r + ' rep' + (r>1?'s':'') + '.';
      }
      var onerm = epley(w, r);
      onermOut.textContent = Math.round(onerm) + ' ' + unit;
      pctRows.forEach(function(row, i){
        var val = Math.round(onerm * pcts[i] / 2.5) * 2.5;
        row.querySelector('.wt').textContent = val + ' ' + unit;
      });
      saveBtn.disabled = (unit !== 'kg');
      if(unit !== 'kg'){
        saveConfirm.textContent = 'Switch to kilograms to save this set into your log.';
      }
    }
    saveBtn.addEventListener('click', function(){
      var w = parseFloat(weightInput.value);
      var r = parseInt(repsInput.value, 10);
      var lift = liftSelect.value;
      if(!w || !r || unit !== 'kg') return;
      var sets = loadSets();
      sets.push({id: uid(), lift: lift, weight: w, reps: r, date: todayISO()});
      saveSets(sets);
      saveConfirm.textContent = 'Saved to your log for today.';
    });
    weightInput.addEventListener('input', calcCalculate);
    repsInput.addEventListener('input', calcCalculate);
    liftSelect.addEventListener('change', calcCalculate);
  }

  function runCountUp(){
    var els = document.querySelectorAll('[data-countup]');
    if(!els.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    els.forEach(function(el){
      var target = parseFloat(el.getAttribute('data-countup'));
      var format = el.getAttribute('data-format');
      var suffix = el.getAttribute('data-suffix') || '';
      function render(v){
        var out;
        if(format === 'decimal'){ out = v.toFixed(1); }
        else if(format === 'comma'){ out = Math.round(v).toLocaleString(); }
        else { out = Math.round(v).toString(); }
        el.textContent = out + suffix;
      }
      if(reduce){ render(target); return; }
      var start = null, duration = 1200;
      function step(ts){
        if(!start) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        render(target * eased);
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    initDashboard();
    initLogForm();
    renderProgress();
    renderPrograms();
    initCalculator();
    runCountUp();
  });
})();

    
