const inputNome = document.getElementById('nome');
const inputNota = document.getElementById('nota');
const btnAdicionar = document.getElementById('btnAdicionar');
const btnCalcularMedia = document.getElementById('btnCalcularMedia');
const listaNotas = document.getElementById('listaNotas');
const mediaTotal = document.getElementById('mediaTotal');

const STORAGE_KEY = 'mediaNotas';

let notas = carregarNotas();

inicializar();

function inicializar() {
    renderizarNotas();
    limparMedia();
    
    btnAdicionar.addEventListener('click', adicionarNota);
    btnCalcularMedia.addEventListener('click', calcularMedia);
    
    inputNota.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adicionarNota();
        }
    });
    
    inputNome.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            inputNota.focus();
        }
    });
}

function adicionarNota() {
    const nome = inputNome.value.trim();
    const nota = parseFloat(inputNota.value);
    
    if (!nome) {
        alert('Por favor, digite o nome do aluno!');
        inputNome.focus();
        return;
    }
    
    if (isNaN(nota) || nota < 0 || nota > 10) {
        alert('Por favor, digite uma nota válida entre 0 e 10!');
        inputNota.focus();
        return;
    }
    
    const novaNota = {
        id: Date.now(),
        nome: nome,
        nota: nota
    };
    
    notas.push(novaNota);
    salvarNotas();
    renderizarNotas();
    limparMedia();
    
    inputNome.value = '';
    inputNota.value = '';
    inputNome.focus();
}

function removerNota(id) {
    notas = notas.filter(nota => nota.id !== id);
    salvarNotas();
    renderizarNotas();
    limparMedia();
}

function renderizarNotas() {
    if (notas.length === 0) {
        listaNotas.innerHTML = '<div class="empty-state">Nenhuma nota cadastrada ainda.</div>';
        return;
    }
    
    listaNotas.innerHTML = notas.map(nota => `
        <div class="nota-item">
            <div class="nota-info">
                <div class="nota-nome">${nota.nome}</div>
                <div class="nota-valor">Nota: ${nota.nota.toFixed(1)}</div>
            </div>
            <button class="btn-remover" onclick="removerNota(${nota.id})">Remover</button>
        </div>
    `).join('');
}

function calcularMedia() {
    if (notas.length === 0) {
        alert('Nenhuma nota cadastrada para calcular a média!');
        return;
    }
    
    const soma = notas.reduce((acc, nota) => acc + nota.nota, 0);
    const media = soma / notas.length;
    
    mediaTotal.innerHTML = `
        <div class="media-label">Média Final</div>
        <div class="media-value">${media.toFixed(2)}</div>
        <div class="media-info">${notas.length} nota${notas.length !== 1 ? 's' : ''} cadastrada${notas.length !== 1 ? 's' : ''}</div>
    `;
    
    const mediaSection = document.querySelector('.media-section');
    mediaSection.classList.add('show');
}

function limparMedia() {
    const mediaSection = document.querySelector('.media-section');
    mediaSection.classList.remove('show');
    mediaTotal.innerHTML = '';
}

function salvarNotas() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
}

function carregarNotas() {
    const notasSalvas = localStorage.getItem(STORAGE_KEY);
    return notasSalvas ? JSON.parse(notasSalvas) : [];
}
