// Estrutura HTML do Regula Vitae (as telas). Os IDs são usados por app.ts.
export const MARKUP = `<div class="topbar"><div class="in">
  <div class="brand">Regula Vitae<small>treino · leitura · hábitos</small></div>
  <nav class="nav" aria-label="Seções">
    <button type="button" data-view="hoje" aria-current="page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>Hoje</button>
    <button type="button" data-view="treino"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/></svg>Treino</button>
    <button type="button" data-view="leitura"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/></svg>Leitura</button>
    <button type="button" data-view="saude"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>Saúde</button>
    <button type="button" data-view="casa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-7 9 7M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>Casa</button>
  </nav>
  <div class="row" style="gap:10px;flex-wrap:nowrap"><div class="sync" id="sync"><i></i><span>Carregando…</span></div><button type="button" class="btn" id="signOut" style="padding:5px 10px;font-size:13px">Sair</button></div>
</div></div>

<div class="wrap">
  <div class="banner" id="localBanner" hidden>Não consegui falar com o banco de dados. O que você registrar agora pode não ser salvo. Confira a internet e recarregue a página.</div>

  <!-- ================= HOJE ================= -->
  <section class="view" id="v-hoje">
    <div class="hello">
      <div class="eyebrow" id="todayLabel">—</div>
      <h1 id="helloTitle">Hoje</h1>
    </div>
    <div class="card" style="margin-top:16px" id="checkin">
      <div class="row" style="justify-content:space-between">
        <h2 style="font-size:24px">Check-in</h2>
        <div class="daynav"><button type="button" id="ciPrev" aria-label="Dia anterior">‹</button><span id="ciDay">Hoje</span><button type="button" id="ciNext" aria-label="Próximo dia">›</button></div>
      </div>
      <div class="ci-grid">
        <div class="ci sleep">
          <div class="ci-h">Sono <small id="sleepDur">—</small></div>
          <div class="row" style="flex-wrap:nowrap">
            <label class="f" for="bedIn" style="min-width:0">Deitei<input type="time" id="bedIn"></label>
            <label class="f" for="wakeIn" style="min-width:0">Acordei<input type="time" id="wakeIn"></label>
          </div>
          <div class="okline" id="sleepInfo"></div>
          <div><div class="muted" style="font-size:14px;margin-bottom:4px">Qualidade</div>
            <div class="q5" id="sleepQ"><button type="button" data-v="1">1</button><button type="button" data-v="2">2</button><button type="button" data-v="3">3</button><button type="button" data-v="4">4</button><button type="button" data-v="5">5</button></div></div>
        </div>
        <div class="ci spirit">
          <div class="ci-h">Vida espiritual <small id="spiritCount">0/3</small></div>
          <div class="chips">
            <button type="button" class="chip" data-k="oracao" aria-pressed="false">Oração da manhã</button>
            <button type="button" class="chip" data-k="terco" aria-pressed="false">Terço</button>
            <button type="button" class="chip" data-k="exame" aria-pressed="false">Exame de consciência</button>
          </div>
          <div class="row" style="justify-content:space-between">
            <div class="okline" id="confInfo">Confissão: sem registro</div>
            <button type="button" class="btn" id="confBtn" style="padding:6px 12px">Me confessei</button>
          </div>
        </div>
        <div class="ci health">
          <div class="ci-h">Saúde <small id="waterMl">0 ml</small></div>
          <div class="row" style="justify-content:space-between">
            <div class="counter"><button type="button" id="waterMinus" aria-label="Menos um copo">−</button><span class="num" id="waterN">0/8</span><button type="button" id="waterPlus" aria-label="Mais um copo">+</button></div>
            <button type="button" class="chip h" data-k="vitd" aria-pressed="false">Vitamina D</button>
          </div>
          <div class="cups" id="cups"></div>
          <div class="row" style="justify-content:space-between">
            <div class="okline" id="weightInfo">Peso: sem registro</div>
            <button type="button" class="btn" id="weighBtn" style="padding:6px 12px">Registrar peso</button>
          </div>
        </div>
        <div class="ci body">
          <div class="ci-h">Alongamento <small id="stretchWeek">0/3 na semana</small></div>
          <div class="okline" id="stretchInfo">Rotina guiada de ~10 min, 3 vezes por semana.</div>
          <div><button type="button" class="btn primary" id="goStretch">Fazer alongamento</button></div>
        </div>
      </div>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn" id="goalsBtn" style="padding:6px 12px">Ajustar metas</button></div>
    </div>
    <div class="cols" style="margin-top:16px">
      <div class="card area">
        <div class="top"><h2>Treino</h2><span class="status" id="hTreinoStatus">Pendente</span></div>
        <div><div id="hTreinoName" style="font-family:var(--display);font-weight:700;font-size:34px;line-height:1;text-transform:uppercase">Full body A</div><div class="muted" id="hTreinoSub"></div></div>
        <button class="btn primary" type="button" id="hTreinoBtn">Abrir treino</button>
      </div>
      <div class="card area readarea">
        <div class="top"><h2>Leitura</h2><span class="status" id="hLeituraStatus">0 min</span></div>
        <div><div class="big2"><span id="hReadMin">0</span><span class="muted" style="font-size:18px"> / <span id="hReadGoal">20</span> min</span></div>
          <div class="muted" id="hReadSub"></div></div>
        <div class="bar read"><i id="hReadBar"></i></div>
        <button class="btn readbtn" type="button" id="hReadBtn">Começar a ler</button>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <h2 style="font-size:22px">Últimos 7 dias</h2>
      <div class="weekgrid" id="hWeek"></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="row" style="justify-content:space-between"><h2 style="font-size:22px">Casa</h2><button type="button" class="btn" id="goCasa" style="padding:6px 12px">Ver todas</button></div>
      <form class="row" id="hTaskForm" style="flex-wrap:nowrap"><input id="hTaskIn" placeholder="Nova tarefa: trocar lâmpada da cozinha" aria-label="Nova tarefa"><button class="btn primary" type="submit">Adicionar</button></form>
      <div class="list" id="hTasks"></div>
    </div>
  </section>

  <!-- ================= SAÚDE ================= -->
  <section class="view" id="v-saude" hidden>
    <div>
      <div class="eyebrow" style="color:var(--water)">Sono · peso · hábitos</div>
      <h1 style="font-size:clamp(32px,6vw,48px)">Saúde</h1>
    </div>
    <div class="cols" style="margin-top:16px">
      <div class="card">
        <div class="row" style="justify-content:space-between"><h2 style="font-size:22px">Peso</h2><button type="button" class="btn" id="weighBtn2" style="padding:6px 12px">Registrar peso</button></div>
        <div class="big2"><span id="wNow">—</span> <span class="muted" style="font-size:16px;font-family:var(--body);font-weight:600" id="wGoalTxt">meta 90 kg</span></div>
        <div id="wChart"></div>
        <div class="list" id="wList"></div>
      </div>
      <div class="card">
        <h2 style="font-size:22px">Sono · 14 noites</h2>
        <div class="meta" id="sleepStats"></div>
        <div id="sChart"></div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <h2 style="font-size:22px">Últimos 30 dias</h2>
      <div class="list" id="habitPct"></div>
      <div class="muted" style="font-size:14px" id="confHist"></div>
    </div>
  </section>

  <!-- ================= CASA ================= -->
  <section class="view" id="v-casa" hidden>
    <div>
      <div class="eyebrow" style="color:var(--rest)">Para não esquecer</div>
      <h1 style="font-size:clamp(32px,6vw,48px)">Tarefas da casa</h1>
    </div>
    <div class="card" style="margin-top:16px">
      <form class="row" id="taskForm">
        <input id="taskIn" placeholder="Ex: consertar a torneira do banheiro" aria-label="Nova tarefa" style="flex:3;min-width:200px">
        <input id="taskDue" type="date" aria-label="Prazo (opcional)" style="flex:1;min-width:150px">
        <button class="btn primary" type="submit">Adicionar</button>
      </form>
      <div class="list" id="taskList"></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="row" style="justify-content:space-between"><h2 style="font-size:22px">Concluídas</h2><button type="button" class="btn danger" id="clearDone" style="padding:6px 12px">Limpar concluídas</button></div>
      <div class="list" id="doneList"></div>
    </div>
  </section>

  <!-- ================= TREINO ================= -->
  <section class="view" id="v-treino" hidden>
    <div>
      <div class="eyebrow">Pós-LCA · full body · sem agachamento · ~20 min</div>
      <h1 style="font-size:clamp(32px,6vw,48px)">Treino</h1>
      <p class="muted" style="margin:6px 0 0;max-width:62ch">Toque num dia da semana ou num treino. Faça as repetições, toque em "Feito" e siga: o descanso entre os rounds é contado sozinho. No fim, o treino fica registrado. Os treinos e a semana são editáveis.</p>
    </div>
    <div class="week" id="week" style="margin-top:16px"></div>
    <div class="tabs" role="tablist" id="tabs" style="margin-top:16px"></div>
    <div class="row" style="margin-top:10px;gap:8px"><button type="button" class="btn" id="editPlanBtn" style="padding:6px 12px">Editar este treino</button><button type="button" class="btn" id="newPlanBtn" style="padding:6px 12px">Novo treino</button><button type="button" class="btn" id="editWeekBtn" style="padding:6px 12px">Editar semana</button></div>
    <div class="player" id="wPlayer" style="margin-top:16px">
      <div class="stage">
        <canvas class="anim" id="stageCanvas" aria-label="Animação do exercício atual"></canvas>
        <div class="now" id="nowName">—</div>
        <div class="cue" id="nowCue"></div>
      </div>
      <div class="clock">
        <span class="phase idle" id="phase">Pronto</span>
        <div class="big" id="big">10</div>
        <div class="unit" id="unit">repetições</div>
        <div class="bar" id="bar"><i id="barFill"></i></div>
        <div class="rounds" id="roundDots"></div>
        <div class="meta"><span>Round <b id="roundTxt">1/5</b></span><span>Exercício <b id="exTxt">1/4</b></span><span>Tempo <b id="totalTxt">00:00</b></span></div>
        <div class="row">
          <button class="btn primary" id="startBtn" type="button" style="min-width:130px">Iniciar</button>
          <button class="btn" id="skipBtn" type="button">Voltar</button>
          <button class="btn" id="resetBtn" type="button">Zerar</button>
          <label class="row muted" for="roundsSel" style="gap:8px;font-size:15px">Rounds
            <select id="roundsSel" style="width:auto"><option value="3">3 (semana 1)</option><option value="4">4</option><option value="5" selected>5</option></select>
          </label>
        </div>
      </div>
    </div>
    <section class="exgrid" id="grid" style="margin-top:16px" aria-label="Exercícios do treino"></section>
    <section id="stretchSec" hidden style="margin-top:16px">
      <div class="player">
        <div class="stage">
          <canvas class="anim" id="stCanvas" aria-label="Animação do alongamento atual"></canvas>
          <div class="eyebrow" id="stSide">Alongamento guiado</div>
          <div class="now" id="stName" style="font-size:34px">Pronto para começar</div>
          <div class="cue" id="stCue">Tensão leve, nunca dor. Respire devagar e não balance.</div>
          <div class="muted" style="font-size:14px" id="stNext"></div>
        </div>
        <div class="clock">
          <span class="phase idle" id="stPhase">Pronto</span>
          <div class="big" id="stBig">30</div>
          <div class="unit">segundos</div>
          <div class="bar" id="stBar"><i id="stBarFill"></i></div>
          <div class="meta"><span>Passo <b id="stStep">1/15</b></span><span>Restante <b id="stLeft">10:00</b></span></div>
          <div class="row">
            <button class="btn primary" id="stStart" type="button" style="min-width:130px">Iniciar</button>
            <button class="btn" id="stSkip" type="button">Pular</button>
            <button class="btn" id="stReset" type="button">Zerar</button>
          </div>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <h2 style="font-size:22px">A rotina</h2>
        <div class="stretch-list" id="stList"></div>
        <div class="avoid"><b>Joelho operado:</b> no posterior da coxa (de onde saiu o enxerto) e no quadríceps, fique na tensão leve. Se puxar ou doer na região da cirurgia, diminua ou pule.</div>
      </div>
    </section>
    <div class="card" id="restCard" hidden style="margin-top:16px"><div class="eyebrow">Descanso</div><h2 style="font-size:24px">Dia livre</h2><p style="margin:0;max-width:62ch">Nenhum treino marcado para este dia. Se quiser se mexer, faça o alongamento guiado ou uma caminhada leve. Para mudar, use "Editar semana".</p></div>
    <div class="card" id="sunday" hidden style="margin-top:16px">
      <div class="eyebrow">Caminhada leve</div>
      <h2 style="font-size:24px">Caminhada leve + mobilidade</h2>
      <p style="margin:0;max-width:62ch">20 minutos de caminhada em ritmo de conversa, depois 5 minutos de mobilidade: círculos de quadril e tornozelo, gato-vaca e rotação de tronco deitado.</p>
      <div><button class="btn primary" type="button" id="walkBtn">Registrar caminhada</button></div>
    </div>
    <div class="cols" style="margin-top:16px">
      <div class="card note">
        <h2>Histórico</h2>
        <div class="list" id="wHistory"></div>
      </div>
      <div class="card note">
        <h2>Cuidados</h2>
        <ul>
          <li>Semana 1: 3 rounds. Suba 1 round a cada 2 ou 3 sessões sem dor.</li>
          <li>Quando os 5 rounds couberem em menos de 18 min com boa forma, some 2 reps em cada exercício.</li>
          <li>Dor no joelho durante o exercício: reduza a amplitude ou pare. Inchaço no dia seguinte: volte um passo.</li>
          <li>A ponte de glúteo (treino A) carrega o posterior da coxa, de onde saiu o enxerto. Esforço leve até o fisio liberar mais.</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ================= LEITURA ================= -->
  <section class="view" id="v-leitura" hidden>
    <div>
      <div class="eyebrow" style="color:var(--read)">Sessões de foco</div>
      <h1 style="font-size:clamp(32px,6vw,48px)">Leitura</h1>
    </div>
    <div class="cols" style="margin-top:16px">
      <div class="card">
        <div class="row" style="justify-content:space-between"><h2 style="font-size:22px">Hoje</h2><button class="btn" type="button" id="goalBtn" style="padding:6px 12px">Meta: <span id="goalLabel">20</span> min</button></div>
        <div class="big2" style="color:var(--read)"><span id="lTodayMin">0</span> <span class="muted" style="font-size:18px">min · <span id="lStreak">0</span> dias seguidos</span></div>
        <div class="bar read"><i id="lGoalBar"></i></div>
        <label class="f" for="timerBook">Qual livro você vai ler?
          <select id="timerBook"></select></label>
        <button class="btn readbtn" type="button" id="startRead">Iniciar sessão de foco</button>
      </div>
      <div class="card">
        <h2 style="font-size:22px">Últimos 7 dias</h2>
        <div class="chartwrap"><div class="chart" id="weekChart"></div></div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="row" style="justify-content:space-between">
        <h2 style="font-size:22px">Biblioteca</h2>
        <div class="row">
          <select id="filterStatus" style="width:auto"><option value="all">Todos</option><option value="lendo">Lendo</option><option value="quero">Quero ler</option><option value="lido">Lidos</option></select>
          <button class="btn readbtn" type="button" id="addBook">Adicionar livro</button>
        </div>
      </div>
      <div class="list" id="bookList"></div>
    </div>
    <div class="cols" style="margin-top:16px">
      <div class="card">
        <h2 style="font-size:22px">Números</h2>
        <div class="stats">
          <div class="stat"><span class="n" id="stTime">0</span><span class="l">Tempo lido</span></div>
          <div class="stat"><span class="n" id="stPages">0</span><span class="l">Páginas</span></div>
          <div class="stat"><span class="n" id="stBooks">0</span><span class="l">Livros lidos</span></div>
          <div class="stat"><span class="n" id="stBest">0</span><span class="l">Maior sequência</span></div>
        </div>
      </div>
      <div class="card">
        <h2 style="font-size:22px">Últimas sessões</h2>
        <div class="list" id="recentSessions"></div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <h2 style="font-size:22px">Trazer dados do app Foco</h2>
      <p class="muted" style="margin:0;max-width:65ch">No app Foco antigo, vá em Stats → Exportar backup. Depois escolha o arquivo .json aqui. Livros e sessões são somados aos que já estão aqui, sem duplicar.</p>
      <div><label class="btn" for="importFile" style="display:inline-block">Escolher backup .json</label>
      <input type="file" id="importFile" accept="application/json,.json" hidden></div>
    </div>
  </section>
</div>

<div class="focus" id="focus" hidden>
  <div class="eyebrow" style="color:var(--read)">Modo foco</div>
  <div class="fbook" id="focusBook"></div>
  <div class="fclock" id="focusClock">00:00</div>
  <p class="muted" style="max-width:34ch;margin:0">Deixe o celular de lado. O tempo está correndo.</p>
  <div class="row"><button class="btn" type="button" id="pauseRead">Pausar</button><button class="btn readbtn" type="button" id="finishRead">Terminei</button></div>
</div>

<div class="modal-bg" id="modalBg" hidden><div class="modal" id="modal" role="dialog" aria-modal="true"></div></div>
<div class="toast" id="toast" role="status"></div>

`;
