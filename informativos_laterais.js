const FAC = [
  {
    id: 'unex',
    name: 'UNEX — Centro Universitário de Excelência (Itabuna)',
    type: 'Privada',
    city: 'Itabuna',
    summary: 'A UNEX (Centro Universitário de Excelência) possui campus em Itabuna com foco em cursos das áreas de Saúde, Direito, Administração e Tecnologia. Oferece estrutura moderna e cursos profissionais voltados ao mercado regional.',
    courses: [
      {code:'med', name:'Medicina', duration:'6 anos', notes:'Curso com laboratórios e estágios clínicos'},
      {code:'odonto', name:'Odontologia', duration:'5 anos', notes:'Clínica-escola e estágios supervisados'},
      {code:'vet', name:'Medicina Veterinária', duration:'5 anos', notes:'Laboratórios e fazenda escola em algumas unidades'},
      {code:'enf', name:'Enfermagem', duration:'4 anos', notes:'Estágios em hospitais parceiros'},
      {code:'bio', name:'Biomedicina', duration:'4 anos'},
      {code:'farm', name:'Farmácia', duration:'4 anos'},
      {code:'nut', name:'Nutrição', duration:'4 anos'},
      {code:'fisio', name:'Fisioterapia', duration:'4-5 anos'},
      {code:'psic', name:'Psicologia', duration:'5 anos'},
      {code:'dir', name:'Direito', duration:'5 anos'},
      {code:'si', name:'Sistemas de Informação', duration:'4-5 anos'}
    ],
    curriculum: 'Geralmente organizado por semestres, com disciplinas obrigatórias, optativas, práticas e estágio/TCC conforme o curso. Consulte PPCs oficiais para grades detalhadas.'
  },

  {
    id: 'unime',
    name: 'UNIME (campus Itabuna)',
    type: 'Privada',
    city: 'Itabuna',
    summary: 'A UNIME possui ampla oferta de cursos presenciais e EAD; preços e modalidades variam por campus e curso. Foco em cursos profissionais e tecnológicos.',
    courses: [
      {code:'adm', name:'Administração'},
      {code:'agr', name:'Agronomia'},
      {code:'arq', name:'Arquitetura e Urbanismo'},
      {code:'biom', name:'Biomedicina'},
      {code:'cc', name:'Ciências Contábeis'},
      {code:'eco', name:'Ciências Econômicas'},
      {code:'dir', name:'Direito'},
      {code:'ads', name:'Análise e Desenvolvimento de Sistemas'},
      {code:'si', name:'Sistemas de Informação'},
      {code:'enf', name:'Enfermagem'},
      {code:'vet', name:'Medicina Veterinária'},
      {code:'nut', name:'Nutrição'},
      {code:'psic', name:'Psicologia'},
      {code:'jrn', name:'Jornalismo'},
      {code:'log', name:'Logística'},
      {code:'md', name:'Marketing Digital'},
      {code:'gd', name:'Gestão de RH'}
    ],
    curriculum: 'Semestral; muitos cursos possuem estágios supervisionados (saúde, educação, engenharia) e TCC/projecto integrador em cursos de tecnologia.'
  },

  {
    id: 'ftc',
    name: 'UniFTC / FTC Itabuna',
    type: 'Privada',
    city: 'Itabuna',
    summary: 'A rede UniFTC (FTC) possui campus em Itabuna com cursos em saúde, tecnologia e engenharias; costuma oferecer estágios e laboratórios práticos.',
    courses: [
      {code:'engc', name:'Engenharia Civil'},
      {code:'engm', name:'Engenharia Mecânica'},
      {code:'si', name:'Sistemas da Informação'},
      {code:'enf', name:'Enfermagem'},
      {code:'nut', name:'Nutrição'},
      {code:'psic', name:'Psicologia'},
      {code:'odont', name:'Odontologia'},
      {code:'vet', name:'Medicina Veterinária'},
      {code:'farm', name:'Farmácia'},
      {code:'fisi', name:'Fisioterapia'}
    ],
    curriculum: 'Grade semestral com ênfase em práticas laboratoriais e estágios para cursos da área da saúde.'
  },

  {
    id: 'uesc',
    name: 'UESC — Universidade Estadual de Santa Cruz',
    type: 'Pública',
    city: 'Ilhéus / atende Itabuna',
    summary: 'Universidade pública estadual com ampla oferta de cursos de graduação e programas de pós-graduação. Também tem oferta EaD em cursos como Letras, Pedagogia, Matemática e Biologia.',
    courses: [
      {code:'adm', name:'Administração'},
      {code:'cc', name:'Ciências Contábeis'},
      {code:'comp', name:'Ciência da Computação'},
      {code:'eco', name:'Economia'},
      {code:'dir', name:'Direito'},
      {code:'engc', name:'Engenharia Civil'},
      {code:'engmec', name:'Engenharia Mecânica'},
      {code:'engel', name:'Engenharia Elétrica'},
      {code:'med', name:'Medicina'},
      {code:'enf', name:'Enfermagem'},
      {code:'bio', name:'Biologia (EaD e presencial)'},
      {code:'mat', name:'Matemática (EaD)'},
      {code:'let', name:'Letras (EaD)'},
      {code:'ped', name:'Pedagogia (EaD)'}
    ],
    curriculum: 'Organização por semestres; disciplinas obrigatórias, optativas, estágios e TCC quando aplicável. Conferir páginas oficiais para matrizes completas.'
  }
];


// para criar elementos HTML
function el(tag,attrs={},text=''){
  const e=document.createElement(tag);
  for(const k in attrs)e.setAttribute(k,attrs[k]);
  e.textContent=text;
  return e
}

// Renderiza a lista de faculdades no sidebar
function renderFacs(){
  const ul = document.getElementById('fac-list');
  ul.innerHTML='';
  
  FAC.forEach(f=>{
    // Cria o link para cada faculdade
    const a = el('a', {'href':'#','data-id':f.id}, f.name + ' • ' + f.type);
    a.style.display='block'; a.style.padding='8px'; a.style.borderRadius='8px'; a.style.textDecoration='none'; a.style.color='#23304a';
    
    // Adiciona o evento de clique para mostrar os detalhes
    a.addEventListener('click', e=>{ e.preventDefault(); showFac(f.id); });
    ul.appendChild(a);
  });
}

// Mostra os detalhes da faculdade selecionada
function showFac(id){
  const f = FAC.find(x=>x.id===id);
  if(!f) return;
  
  const det = document.getElementById('fac-detail');
  det.innerHTML='';
  
  // Nome da faculdade
  const h = el('div',{}, '<strong>'+f.name+'</strong>');
  h.innerHTML = '<strong>' + f.name + '</strong>';
  
  // Resumo
  const p = el('div',{}, f.summary);
  
  // Tipo e Cidade
  const meta = el('div',{}, 'Tipo: ' + f.type + ' — Cidade: ' + f.city);
  meta.className='muted';
  
  // Título da seção de Cursos
  const ctitle = el('div',{}, 'Cursos (resumo)');
  ctitle.className='section-title';
  
  // Lista de Cursos
  const cl = document.createElement('div');
  cl.className='course-list';
  
  f.courses.forEach(c=>{
    const row = document.createElement('div');
    row.style.display='flex';
    row.style.justifyContent='space-between';
    
    const left = document.createElement('div');
    left.textContent = c.name + (c.duration ? ' • ' + c.duration : '');
    
    // Botão para mostrar o detalhe do curso 
    const more = document.createElement('button');
    more.textContent='Resumo';
    more.className='btn';
    more.style.border='0';
    more.style.background='transparent';
    more.style.color='var(--primary)';
    more.style.cursor='pointer';
    more.addEventListener('click', ()=> showCourseDetail(f.id, c.code));
    
    row.appendChild(left);
    row.appendChild(more);
    cl.appendChild(row);
  });
  
  // Adiciona tudo ao painel de detalhes
  det.appendChild(h);
  det.appendChild(p);
  det.appendChild(meta);
  det.appendChild(ctitle);
  det.appendChild(cl);
  
  // Preenche automaticamente o simulador com o nome da faculdade e o primeiro curso
  document.getElementById('college').value = f.name;
  if(f.courses && f.courses.length) document.getElementById('course').value = f.courses[0].name;
}

// Mostra o resumo do curso 
function showCourseDetail(fId, code){
  const f = FAC.find(x=>x.id===fId);
  if(!f) return;
  const c = f.courses.find(x=>x.code===code);
  
  if(!c) { alert('Detalhes não encontrados.'); return; }
  
  // Cria e estiliza o modal simples
  const msg = document.createElement('div');
  msg.style.position='fixed';
  msg.style.left='50%';
  msg.style.top='50%';
  msg.style.transform='translate(-50%,-50%)';
  msg.style.background='white';
  msg.style.padding='16px';
  msg.style.boxShadow='0 10px 30px rgba(10,20,40,0.2)';
  msg.style.zIndex=9999;
  msg.style.borderRadius='8px';
  
  // Conteúdo do modal
  msg.innerHTML = '<strong>'+c.name+'</strong><div class="muted" style="margin-top:8px">'+(c.notes||'Resumo: matriz curricular organizada por semestres, com aulas teóricas e práticas. Consulte PPC para matriz completa.')+'</div><div style="margin-top:12px;text-align:right"><button onclick="this.parentNode.parentNode.remove()" class="btn-link">Fechar</button></div>';
  
  document.body.appendChild(msg);
}



// Função principal de cálculo de gastos
function calculate(){
  // Captura os valores dos campos
  const food = Number(document.getElementById('food').value || 0);
  const transport = Number(document.getElementById('transport').value||0);
  const other = Number(document.getElementById('other').value||0);
  const tuition = Number(document.getElementById('tuition').value||0);
  
  // Soma o total
  const total = food+transport+other+tuition;
  
  // Exibe o resultado formatado em Reais
  const r = document.getElementById('result');
  r.style.display='block';
  r.innerHTML = '<strong>Estimativa mensal:</strong> R$ ' + total.toLocaleString('pt-BR');
}

// Função para limpar o formulário e esconder o resultado
function clearForm(){ 
  document.getElementById('simForm').reset();
  document.getElementById('result').style.display='none';
}
/* ======== COMPORTAMENTO DO MENU MOBILE / PANEL ======== */
// Busca os elementos do menu e do overlay
const openMenu = document.getElementById('openMenu');
const overlay = document.getElementById('overlay');
const panel = document.getElementById('panel');

// Função para fechar o menu mobile
function closePanel(){
  panel.classList.remove('open');
  overlay.classList.remove('show');
  panel.setAttribute('aria-hidden','true');
  overlay.setAttribute('aria-hidden','true');
}

// Adiciona os listeners de clique para abrir/fechar
if (openMenu) openMenu.addEventListener('click', ()=>{
  panel.classList.add('open');
  overlay.classList.add('show');
  panel.setAttribute('aria-hidden','false');
  overlay.setAttribute('aria-hidden','false');
});

// Nota: Você precisaria adicionar o botão de fechar (#closePanel) no HTML do painel.
if (overlay) overlay.addEventListener('click', closePanel);

// Inicializa a renderização das faculdades ao carregar o script
renderFacs();