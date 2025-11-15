const Sistema = (function () {
    
    // --- DADOS DO JOGO (STATE) ---
    const status = {
        alias: "N/A",
        email: "N/A",
        xp: 0,
        level: 1,
        aulasVistas: 0,
        simuladosFeitos: 0,
        trofeus: new Set(),
        currentScreen: 'auth'
    };

    const LIMITES_LEVEL = [0, 150, 350, 650, 1050];
    const LOG_ELEMENT = document.getElementById('dashboard-log');
    const NAV_BAR = document.getElementById('app-nav-bar');

    // --- CONTEÚDO RICO SIMULADO ---
    const AULAS = [
        { id: 1, materia: "Matemática", titulo: "Equações de 2º Grau: Fórmulas de Bashkara", link: "https://youtube.com/watch?v=eq2G", tempo: "12 min", xp: 30 },
        { id: 2, materia: "Biologia", titulo: "O Ciclo de Krebs e a Produção de ATP", link: "https://youtube.com/watch?v=ckrebs", tempo: "8 min", xp: 30 },
        { id: 3, materia: "Redação", titulo: "Argumentos de Autoridade: Como Usar na Tese", link: "https://youtube.com/watch?v=redacao", tempo: "15 min", xp: 30 }
    ];
    
    const SIMULADOS = [
        { id: 1, tema: "Matemática", pergunta: "Qual o resultado de $\\int x^2 dx$?", alternativas: ["$x^3/3 + C$", "$x^2/2 + C$", "$2x$"], correta: 0, xp: 50, respondido: false },
        { id: 2, tema: "História", pergunta: "Qual tratado dividiu o mundo entre Portugal e Espanha em 1494?", alternativas: ["Tratado de Madri", "Tratado de Tordesilhas", "Tratado de Versalhes"], correta: 1, xp: 50, respondido: false }
    ];
    
    const PROJETOS = [
        { id: 1, descricao: "Revisar anotações da semana", concluido: false, xp: 25 },
        { id: 2, descricao: "Fazer o Simulado de História", concluido: false, xp: 25 }
    ];

    const TROFEUS = [
        { id: "primeira-aula", titulo: "Módulo Visto", icon: "fas fa-medal", texto: "Assistir a primeira Aula Express." },
        { id: "primeiro-simulado", titulo: "Avaliação Completa", icon: "fas fa-trophy", texto: "Acertar o primeiro Simulado." },
        { id: "primeira-tarefa", titulo: "Foco Concluído", icon: "fas fa-check-double", texto: "Completar a primeira Tarefa de Foco." }
    ];
    
    // Variável interna para controle de estados mutáveis
    const state = {
        aulas: AULAS.map(a => ({ ...a, vista: false })),
        simulados: SIMULADOS.map(s => ({ ...s, respondido: false, acerto: null })),
        projetos: PROJETOS.map(p => ({ ...p }))
    };


    // --- LÓGICA DE JOGO E XP ---

    function calculateLevel() {
        let level = 1;
        for (let i = LIMITES_LEVEL.length - 1; i >= 0; i--) {
            if (status.xp >= LIMITES_LEVEL[i]) {
                level = i + 1;
                break;
            }
        }
        status.level = level;
    }

    function addXP(valor, log) {
        status.xp += valor;
        calculateLevel();
        updateHeaderAndXPVisual();
        logToDashboard(`🌟 +${valor} XP: ${log}`);
    }

    function unlockTrofeu(id, log) {
        if (!status.trofeus.has(id)) {
            status.trofeus.add(id);
            logToDashboard(`🏆 TROFÉU: ${log}`, 'trofeu');
            if (status.currentScreen === 'perfil') renderPerfil();
        }
    }
    
    // --- INTERFACE/RENDERIZAÇÃO GERAL ---

    function logToDashboard(message, type = 'normal') {
        if (LOG_ELEMENT) {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.padding = '10px';
            div.style.marginBottom = '8px';
            div.style.fontSize = '12px';
            div.style.backgroundColor = '#2c2c40';
            
            const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            div.innerHTML = `<span style="color: var(--cor-destaque); margin-right: 5px;">[${time}]</span> ${message}`;
            
            LOG_ELEMENT.prepend(div);
            // Mantém apenas 4 logs
            while(LOG_ELEMENT.children.length > 4) {
                LOG_ELEMENT.removeChild(LOG_ELEMENT.lastChild);
            }
        }
    }

    function updateHeaderAndXPVisual() {
        const currentLevelIndex = status.level - 1;
        const currentXPBase = LIMITES_LEVEL[currentLevelIndex] || 0;
        const nextXP = LIMITES_LEVEL[currentLevelIndex + 1] || (currentXPBase + 400);
        
        const xpNoNivel = status.xp - currentXPBase;
        const intervalo = nextXP - currentXPBase;
        const porcentagem = Math.max(0, Math.min(100, (xpNoNivel / intervalo) * 100));

        const levelText = `LV ${status.level}`;
        
        // Header
        document.getElementById('header-alias').textContent = status.alias;
        document.getElementById('header-level').textContent = levelText;

        // Dashboard XP
        if (document.getElementById('dashboard-xp-bar')) {
            document.getElementById('dashboard-xp-text').textContent = `${status.xp} XP`;
            document.getElementById('dashboard-level-text').textContent = `${levelText} / Próximo: ${nextXP} XP`;
            document.getElementById('dashboard-xp-bar').style.width = porcentagem + "%";
        }
    }
    
    // --- FUNÇÕES DE MÓDULO (FUNCIONALIDADE) ---

    // Módulo: Aulas Express
    function renderAulas() {
        const container = document.getElementById('aulas-list');
        container.innerHTML = '';

        state.aulas.forEach(aula => {
            const div = document.createElement('div');
            div.className = 'card aula-card';
            
            const btnText = aula.vista ? 'AULA CONCLUÍDA' : `ASSISTIR (+${aula.xp} XP)`;
            const btnClass = aula.vista ? 'btn-secundario' : 'btn-primario';
            const btnDisabled = aula.vista ? 'disabled' : '';

            div.innerHTML = `
                <div class="video-thumb"><i class="fas fa-play" style="color: white;"></i></div>
                <div class="video-details">
                    <div class="video-title">${aula.titulo}</div>
                    <div class="video-meta">${aula.materia} | Duração: ${aula.tempo}</div>
                    <a href="${aula.link}" target="_blank" class="video-link" onclick="Sistema.viewAula(${aula.id})">VER VÍDEO COMPLETO</a>
                </div>
                <button class="btn ${btnClass}" style="width:auto; font-size:11px;" ${btnDisabled} onclick="Sistema.viewAula(${aula.id}, true)">${btnText}</button>
            `;
            container.appendChild(div);
        });
    }
    
    function viewAula(id, fromButton = false) {
        const aula = state.aulas.find(a => a.id === id);
        if (!aula || aula.vista) return;

        if (fromButton) {
            aula.vista = true;
            status.aulasVistas += 1;
            addXP(aula.xp, `Aula Express de ${aula.materia} concluída.`);
            unlockTrofeu("primeira-aula", "MÓDULO VISTO");
            renderAulas();
        }
    }

    // Módulo: Simulados
    function renderSimulados() {
        const container = document.getElementById('simulados-list');
        container.innerHTML = '';
        
        state.simulados.forEach(simulado => {
            const div = document.createElement('div');
            div.className = 'card quiz-card';
            
            let optionsHTML = '';
            const isDisabled = simulado.respondido ? 'disabled' : '';
            simulado.alternativas.forEach((alt, index) => {
                const isChecked = (simulado.respondido && simulado.acerto !== null && index === simulado.respostaEscolhida) ? 'checked' : '';
                optionsHTML += `
                    <label>
                        <input type="radio" name="quiz-${simulado.id}" value="${index}" ${isDisabled} ${isChecked} />
                        ${alt}
                    </label>
                `;
            });

            let feedbackHTML = '';
            let btnHTML = '';

            if (simulado.respondido) {
                const resultClass = simulado.acerto ? 'success' : 'error';
                const resultText = simulado.acerto 
                    ? `ACERTOU! Foco recompensado com +${simulado.xp} XP.` 
                    : `ERRO. Resposta correta era: ${simulado.alternativas[simulado.correta]}.`;
                
                feedbackHTML = `<div class="feedback ${resultClass}">${resultText}</div>`;
                btnHTML = `<button class="btn btn-secundario" disabled>SIMULADO FINALIZADO</button>`;
            } else {
                    btnHTML = `<button class="btn btn-primario" onclick="Sistema.processarSimulado(${simulado.id})">RESPONDER E AVALIAR (+${simulado.xp} XP)</button>`;
            }

            div.innerHTML = `
                <p style="font-weight: 600; color: var(--cor-destaque);">Simulado de ${simulado.tema}</p>
                <p>${simulado.pergunta}</p>
                <div class="quiz-options">${optionsHTML}</div>
                ${feedbackHTML}
                ${btnHTML}
            `;
            
            container.appendChild(div);
        });
    }

    function processarSimulado(id) {
        const simulado = state.simulados.find(s => s.id === id);
        if (!simulado || simulado.respondido) return;
        
        const radios = document.querySelectorAll(`input[name='quiz-${id}']:checked`);
        if (radios.length === 0) {
            alert('Selecione uma resposta.');
            return;
        }
        
        const escolha = parseInt(radios[0].value, 10);
        simulado.respondido = true;
        simulado.respostaEscolhida = escolha;
        status.simuladosFeitos += 1;
        
        if (escolha === simulado.correta) {
            simulado.acerto = true;
            addXP(simulado.xp, `Simulado de ${simulado.tema} concluído com acerto.`);
            unlockTrofeu("primeiro-simulado", "AVALIAÇÃO COMPLETA");
        } else {
            simulado.acerto = false;
            logToDashboard(`Simulado de ${simulado.tema} falhou. Sem XP de recompensa.`, 'erro');
        }
        
        renderSimulados();
    }
    
    // Módulo: Projetos Foco
    function renderProjetos() {
        const container = document.getElementById('projetos-list');
        container.innerHTML = '';
        
        state.projetos.forEach(projeto => {
            const div = document.createElement('div');
            div.className = 'card aula-card';
            
            const btnText = projeto.concluido ? 'CONCLUÍDA' : `FINALIZAR (+${projeto.xp} XP)`;
            const btnClass = projeto.concluido ? 'btn-secundario' : 'btn-primario';
            const btnDisabled = projeto.concluido ? 'disabled' : '';

            div.innerHTML = `
                <div class="video-details">
                    <div class="video-title">${projeto.descricao}</div>
                    <div class="video-meta">${projeto.concluido ? 'STATUS: OK' : 'STATUS: PENDENTE'}</div>
                </div>
                <button class="btn ${btnClass}" style="width:auto; font-size:11px;" ${btnDisabled} onclick="Sistema.completeTarefa(${projeto.id})">${btnText}</button>
            `;
            container.appendChild(div);
        });
    }

    function addTarefa() {
        const input = document.getElementById('nova-tarefa-input');
        const descricao = input.value.trim();
        
        if (descricao) {
            const newId = state.projetos.length + 1;
            const novaTarefa = {
                id: newId,
                descricao: descricao,
                concluido: false,
                xp: 25 // XP padrão para tarefa
            };
            state.projetos.push(novaTarefa);
            input.value = '';
            logToDashboard(`Nova tarefa adicionada: ${descricao}`);
            renderProjetos();
        } else {
            alert('Digite a descrição da tarefa.');
        }
    }
    
    function completeTarefa(id) {
        const projeto = state.projetos.find(p => p.id === id);
        if (!projeto || projeto.concluido) return;

        projeto.concluido = true;
        addXP(projeto.xp, `Tarefa de foco "${projeto.descricao}" concluída.`);
        unlockTrofeu("primeira-tarefa", "FOCO CONCLUÍDO");
        renderProjetos();
    }

    // Módulo: Perfil
    function renderPerfil() {
        document.getElementById('perfil-alias').textContent = status.alias;
        document.getElementById('perfil-email').textContent = status.email;
        document.getElementById('perfil-level').textContent = `LV ${status.level}`;
        document.getElementById('perfil-xp').textContent = status.xp;
        document.getElementById('perfil-aulas').textContent = status.aulasVistas;
        document.getElementById('perfil-simulados').textContent = status.simuladosFeitos;

        const grid = document.getElementById('perfil-trofeus');
        grid.innerHTML = '';
        
        TROFEUS.forEach(trofeu => {
            const unlocked = status.trofeus.has(trofeu.id);
            const div = document.createElement('div');
            div.className = 'trophy';
            if (unlocked) div.classList.add('unlocked');
            
            div.innerHTML = `
                <div class="trophy-icon"><i class="${trofeu.icon}"></i></div>
                <div style="font-weight: 600; color: var(--cor-texto-principal);">${trofeu.titulo}</div>
                <div style="color: var(--cor-texto-suave); font-size: 9px; margin-top: 2px;">${trofeu.texto}</div>
            `;
            grid.appendChild(div);
        });
    }

    // --- NAVEGAÇÃO E CONTROLE DE TELAS ---

    function navigateTo(screenId) {
        // Remove a classe 'active' de todas as telas
        document.querySelectorAll('.app-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Adiciona a classe 'active' à tela desejada
        document.getElementById(`screen-${screenId}`).classList.add('active');
        status.currentScreen = screenId;
        
        // Atualiza o menu de navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('ativo', item.dataset.target === screenId);
        });

        // Mostra/Esconde a navegação fixa
        NAV_BAR.style.display = (screenId === 'auth') ? 'none' : 'flex';
        
        // Dispara renderização específica
        if (screenId === 'dashboard') {
            document.getElementById('dashboard-saudacao').textContent = `Bem-vindo(a) de volta, ${status.alias}!`;
        }
        if (screenId === 'aulas') renderAulas();
        if (screenId === 'simulados') renderSimulados();
        if (screenId === 'projetos') renderProjetos();
        if (screenId === 'perfil') renderPerfil();
        
        if (screenId === 'auth') {
            resetState();
        }
    }

    function initialize() {
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const alias = document.getElementById('auth-alias').value.trim() || "Player_X";
            status.alias = alias;
            status.email = "simulado@email.com";
            initializeState();
            logToDashboard(`Acesso concedido. Iniciando a sessão de produtividade.`);
            navigateTo('dashboard');
        });
        
        updateHeaderAndXPVisual();
    }

    function initializeState() {
        // Reinicializa o estado
        status.xp = 0;
        status.level = 1;
        status.aulasVistas = 0;
        status.simuladosFeitos = 0;
        status.trofeus = new Set();
        
        state.aulas = AULAS.map(a => ({ ...a, vista: false }));
        state.simulados = SIMULADOS.map(s => ({ ...s, respondido: false, acerto: null, respostaEscolhida: null }));
        state.projetos = PROJETOS.map(p => ({ ...p }));
        
        updateHeaderAndXPVisual();
    }

    function resetState() {
        initializeState();
        status.alias = "N/A";
        status.email = "N/A";
        updateHeaderAndXPVisual();
    }

    initialize();

    // Retorna a API pública
    return {
        navigateTo: navigateTo,
        viewAula: viewAula,
        processarSimulado: processarSimulado,
        addTarefa: addTarefa,
        completeTarefa: completeTarefa
    };
})();

window.Sistema = Sistema;