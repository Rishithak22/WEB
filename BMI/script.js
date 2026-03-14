let unit = 'metric';
let gender = 'male';
function setUnit(u) {
      unit = u;
      document.getElementById('btnMetric').classList.toggle('active', u === 'metric');
      document.getElementById('btnImperial').classList.toggle('active', u === 'imperial');
      document.getElementById('heightMetric').style.display = u === 'metric' ? '' : 'none';
      document.getElementById('heightImperial').style.display = u === 'imperial' ? '' : 'none';
      document.getElementById('weightMetric').style.display = u === 'metric' ? '' : 'none';
      document.getElementById('weightImperial').style.display = u === 'imperial' ? '' : 'none';
}
function setGender(g) {
      gender = g;
      document.getElementById('btnMale').classList.toggle('active', g === 'male');
      document.getElementById('btnFemale').classList.toggle('active', g === 'female');
}
function updateAge(val) {
      document.getElementById('age').value = val;
}
function updateHeight(val) {
      document.getElementById('heightCm').value = val;
}
function updateWeight(val) {
      document.getElementById('weightKg').value = val;
}
function calculateBMI() {
      const age = parseInt(document.getElementById('ageSlider').value);
      let heightM, weightKg;
      if (unit === 'metric') {
        heightM = parseFloat(document.getElementById('heightCm').value) / 100;
        weightKg = parseFloat(document.getElementById('weightKg').value);
      } else {
        const ft = parseFloat(document.getElementById('heightFt').value) || 0;
        const inc = parseFloat(document.getElementById('heightIn').value) || 0;
        const totalInches = ft * 12 + inc;
        heightM = totalInches * 0.0254;
        weightKg = parseFloat(document.getElementById('weightLbs').value) * 0.453592;
      }
      if (!heightM || !weightKg || heightM <= 0) return;
      const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
      showResult(bmi, age, gender);
      document.getElementById('btnReset').style.display = '';
}
function resetForm() {
      document.getElementById('ageSlider').value = 25;
      updateAge(25);
      document.getElementById('heightCm').value = 170;
      document.getElementById('weightKg').value = 70;
      document.getElementById('heightFt').value = 5;
      document.getElementById('heightIn').value = 7;
      document.getElementById('weightLbs').value = 154;
      setGender('male');
      setUnit('metric');
      document.getElementById('resultSection').style.display = 'none';
      document.getElementById('btnReset').style.display = 'none';
 }
function getCategory(bmi, gender, age) {
      let underMax = 18.5, normalMax = 25, overMax = 30;
      if (gender === 'female') { underMax = 18; normalMax = 24.5; }
      if (bmi < underMax) return {
        label: 'Underweight', color: 'var(--bmi-underweight)',
        bg: 'rgba(59,130,246,0.1)', icon: 'fa-arrow-down',
        tipClass: 'info',
        tip: age < 18
          ? 'Growing bodies need adequate nutrition. Consult a pediatrician about healthy weight gain.'
          : 'Consider increasing caloric intake with nutrient-dense foods. A dietitian can help create a balanced plan.'
      };
      if (bmi < normalMax) return {
        label: 'Normal Weight', color: 'var(--bmi-normal)',
        bg: 'rgba(34,171,90,0.1)', icon: 'fa-check',
        tipClass: '',
        tip: 'Great job! Maintain your healthy weight through balanced nutrition and regular physical activity.'
      };
      if (bmi < overMax) return {
        label: 'Overweight', color: 'var(--bmi-overweight)',
        bg: 'rgba(245,166,15,0.1)', icon: 'fa-exclamation-triangle',
        tipClass: 'warning',
        tip: age > 60
          ? 'At your age, a slightly higher BMI can be normal. Focus on staying active and eating well.'
          : 'Small lifestyle changes can make a big difference. Try 30 minutes of daily activity and balanced meals.'
      };
      return {
        label: 'Obese', color: 'var(--bmi-obese)',
        bg: 'rgba(220,50,50,0.1)', icon: 'fa-exclamation-circle',
        tipClass: 'danger',
        tip: 'Consult a healthcare professional for a personalized weight management plan. Even small weight loss can improve health.'
      };
}
function showResult(bmi, age, genderVal) {
      const cat = getCategory(bmi, genderVal, age);
      const clampedBmi = Math.min(Math.max(bmi, 10), 40);
      const needlePercent = ((clampedBmi - 10) / 30) * 100;
      const categories = [
          { label: 'Underweight', range: '< 18.5',    color: '#3b82f6', fillPct: 28.3 },
          { label: 'Normal',      range: '18.5 – 25', color: '#22ab5a', fillPct: 21.7 },
          { label: 'Overweight',  range: '25 – 30',   color: '#f5a60f', fillPct: 16.7 },
          { label: 'Obese',       range: '> 30',      color: '#dc3232', fillPct: 33.3 },
  ];
  
  const activeLabel = cat.label.toLowerCase();
  let rangesHTML = categories.map(c => {
   const isActive = activeLabel.includes(c.label.toLowerCase()) || c.label.toLowerCase().includes(activeLabel.split(' ')[0]);
          return `
        <div class="range-bar-container">
          <div class="range-label">
            <span style="color:${isActive ? c.color : ''}; font-weight: ${isActive ? '800' : '600'}"> ${isActive ? `<i class="fa-solid fa-caret-right me-1"></i>` : ''}${c.label}</span>
            <span class="text-muted">${c.range}</span>
          </div>
          <div style="background:#e2e8f0; border-radius:4px; height:8px; width:100%; overflow:hidden;">
            <div style="background:${c.color}; width:${isActive ? '100' : '40'}%; height:100%; border-radius:4px; opacity:${isActive ? '1' : '0.35'}; transition: width 0.6s ease;"></div>
          </div>
        </div>       
      `}).join('');
      document.getElementById('resultSection').innerHTML = `
        <div class="result-section">
          <div class="card-glass p-4 text-center mb-3">
            <p class="text-muted small mb-1 fw-semibold">YOUR BMI</p>
            <div class="bmi-big" style="color:${cat.color};">${bmi}</div>
            <div class="mt-2 mb-3">
              <span class="category-badge" style="background:${cat.bg}; color:${cat.color};">
                <i class="fa-solid ${cat.icon}"></i> ${cat.label}
              </span>
            </div>
            <div class="d-flex justify-content-center gap-2 mb-3">
              <span class="info-badge"><i class="fa-solid fa-calendar-days"></i> Age: ${age}</span>
              <span class="info-badge"><i class="fa-solid fa-${genderVal === 'male' ? 'mars' : 'venus'}"></i> ${genderVal.charAt(0).toUpperCase() + genderVal.slice(1)}</span>
            </div>
            <!-- Gauge bar -->
            <div class="gauge-wrapper">
            <div class="gauge-bar">
              <div class="gauge-needle" style="left:calc(${needlePercent}% - 2px);"></div>
            </div>
            </div>
            <div class="gauge-labels">
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>
          <!-- Ranges -->
          <div class="card-glass p-4 mb-3">
            <h6 class="fw-bold mb-3"><i class="fa-solid fa-chart-bar me-1 text-muted"></i> BMI Ranges</h6>
            ${rangesHTML}
            <div class="mt-3 text-center">
              <div style="width:3px;height:20px;background:#1e293b;display:inline-block;border-radius:2px;"></div>
              <div class="small text-muted fw-semibold">Your BMI: ${bmi}</div>
            </div>
          </div>
          <!-- Tip -->
          <div class="tip-card ${cat.tipClass} mb-4">
            <div class="fw-bold small mb-1"><i class="fa-solid fa-lightbulb me-1"></i> Health Tip</div>
            <div class="small text-muted">${cat.tip}</div>
          </div>
        </div>
      `;
      document.getElementById('resultSection').style.display = '';
    }
