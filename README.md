## MANUAL DO USUÁRIO MVP: EDU+CONNECT

Este documento descreve as funcionalidades e o protocolo de uso da versão MVP (Produto Mínimo Viável) da plataforma **Edu+Connect**.

---

## 1. Visão Geral e Protocolo de Uso

O **Edu+Connect** é uma plataforma modular de gamificação projetada para incentivar a produtividade e o engajamento em tarefas educacionais, utilizando um sistema de **XP (Pontos de Experiência)** e Níveis.

| Componente | Função |
| :--- | :--- |
| **Estética** | Interface de alta performance (Dark Mode), modular e responsiva para mobile. |
| **Acesso** | Autenticação simples via **Alias** (nome de usuário) na tela inicial. Não requer senha. |
| **Progresso** | Todo o progresso é baseado em XP, que desbloqueia Níveis e Troféus. |

### 1.1 Status da Sessão

O **Header (Status Bar)** e o **Dashboard** fornecem métricas em tempo real da sua sessão:

* **LV (Nível):** Indica o nível de proficiência e engajamento alcançado.
* **Barra XP:** Visualização do XP acumulado e do progresso percentual até o próximo nível.
* **Log de Atividade:** Exibe o histórico das últimas interações que geraram XP ou concluíram módulos.

---

## 2. Módulos Funcionais (Workflow)

A funcionalidade do **Edu+Connect** é organizada em três módulos interativos principais, acessíveis pelo menu de navegação.

### 2.1 Módulo: Aulas Express

Este módulo simula a conclusão de conteúdo de aprendizagem rápido.

| Ação do Usuário | Condição de Recompensa | Recompensa/Efeito |
| :--- | :--- | :--- |
| Clicar em **"Assistir (+XP)"** | Aula não marcada como concluída na sessão atual. | Concede **30 XP**. A aula é marcada como **CONCLUÍDA** permanentemente na sessão. |
| **Ver Vídeo Completo** | Não há. | Redireciona para o link de conteúdo externo simulado. Não concede XP. |
| Desbloqueio | Conclusão da primeira aula. | Troféu: **Módulo Visto**. |

### 2.2 Módulo: Simulados

Módulo de avaliação de conhecimento com feedback imediato.

| Ação do Usuário | Condição de Recompensa | Recompensa/Efeito |
| :--- | :--- | :--- |
| **Selecionar Opção + Avaliar** | Simulado não respondido na sessão atual. | Se a resposta estiver **CORRETA**, concede **50 XP**. Se **INCORRETA**, não concede XP, mas o simulado é finalizado. |
| Desbloqueio | Acerto do primeiro simulado. | Troféu: **Avaliação Completa**. |

### 2.3 Módulo: Projetos Foco

Ferramenta de gerenciamento de tarefas gamificado.

| Ação do Usuário | Condição de Recompensa | Recompensa/Efeito |
| :--- | :--- | :--- |
| **Adicionar Tarefa** | Campo de descrição preenchido. | Cria um novo objetivo. Não concede XP. |
| Clicar em **"Finalizar (+XP)"** | Tarefa não concluída. | Concede **25 XP**. A tarefa é marcada como **CONCLUÍDA**. |
| Desbloqueio | Conclusão do primeiro projeto. | Troféu: **Foco Concluído**. |

---

## 3. Módulo: Perfil (Status Geral)

O Módulo Perfil é um painel de indicadores de desempenho.

* **Estatísticas:** Exibe o valor total de XP, o Nível atual, e a contagem de Aulas Concluídas e Simulados Feitos.
* **Troféus:** Exibe as conquistas alcançadas, validando a exploração de todas as funcionalidades da plataforma.

---

## 4. Limitações Críticas (MVP)

O **Edu+Connect** está em fase de MVP e possui as seguintes limitações de arquitetura:

1.  **Não Persistência de Dados:** O sistema não utiliza banco de dados. Todo o progresso (**XP, Níveis, Status dos Módulos**) é armazenado apenas na memória da sessão atual. **Ao encerrar a sessão** (clicando em "ENCERRAR SESSÃO") **ou fechar o navegador, todos os dados são resetados.**
2.  **Conteúdo Estático:** Os dados de Aulas, Simulados e Projetos iniciais são fixos e definidos no código-fonte. Não há interface para inserção ou modificação dinâmica de conteúdo.
3.  **Autenticação Funcional:** O acesso via Alias é um requisito funcional de navegação e não um protocolo de segurança.
