let currentStep = 0;
let stepsData = [];
let panzoomInstance;

const diagramImg = document.getElementById('diagram-img');
const popup = document.getElementById('info-popup');
const progressBar = document.getElementById('progress-bar');
const minimapViewbox = document.getElementById('minimap-viewbox');

// Iniciar Panzoom
panzoomInstance = Panzoom(diagramImg, { maxScale: 5, minScale: 0.5, contain: 'outside', step: 0.2 });
diagramImg.parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel);

async function loadLanguage(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        const data = await response.json();
        stepsData = data.steps;

        document.getElementById('btn-next').innerText = data.general.next;
        document.getElementById('btn-prev').innerText = data.general.prev;
        document.getElementById('btn-overview').innerText = data.general.overview;
        document.getElementById('btn-info').innerText = data.general.info;

        goToStep(currentStep); // Refrescar vista actual
    } catch (e) { console.error("Error cargando JSON", e); }
}

function goToStep(index) {
    if (index < 0 || index >= stepsData.length) return;
    currentStep = index;
    const step = stepsData[currentStep];

    // Mover y Zoom
    panzoomInstance.pan(step.x, step.y, { animate: true, duration: 800 });
    setTimeout(() => panzoomInstance.zoom(step.scale, { animate: true, duration: 800 }), 50);

    // Actualizar UI
    document.getElementById('popup-title').innerText = step.title;
    document.getElementById('popup-text').innerText = step.text;
    
    if (currentStep === 0) popup.classList.add('hidden');
    else popup.classList.remove('hidden');

    // Progreso
    progressBar.style.width = `${(currentStep / (stepsData.length - 1)) * 100}%`;

    // Minimapa
    minimapViewbox.style.transform = `scale(${1 / step.scale})`;
}

// Botones
document.getElementById('btn-next').addEventListener('click', () => goToStep(currentStep + 1));
document.getElementById('btn-prev').addEventListener('click', () => goToStep(currentStep - 1));
document.getElementById('btn-overview').addEventListener('click', () => goToStep(0));
document.getElementById('btn-info').addEventListener('click', () => popup.classList.toggle('hidden'));

function changeLanguage(lang) {
    window.history.pushState({}, '', `?lang=${lang}`);
    loadLanguage(lang);
}

// Teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goToStep(currentStep + 1);
    if (e.key === 'ArrowLeft') goToStep(currentStep - 1);
    if (e.key === ' ') { e.preventDefault(); popup.classList.toggle('hidden'); }
});

// Capturar coordenadas (doble click)
diagramImg.addEventListener('dblclick', () => {
    const pan = panzoomInstance.getPan();
    const scale = panzoomInstance.getScale();
    console.log(`"x": ${pan.x.toFixed(0)}, "y": ${pan.y.toFixed(0)}, "scale": ${scale.toFixed(1)}`);
    alert(`Coordenadas en consola: x:${pan.x.toFixed(0)}, y:${pan.y.toFixed(0)}, scale:${scale.toFixed(1)}`);
});

window.onload = () => {
    const lang = new URLSearchParams(window.location.search).get('lang') || 'es';
    loadLanguage(lang);
    setTimeout(() => goToStep(0), 300);
};
