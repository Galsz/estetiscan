
# EstetiScan AI — Documento Geral do Projeto

## 1. Visão geral

Este projeto propõe a criação de um **Sistema Automatizado de Triagem, Padronização e Segmentação de Imagens para Clínicas de Estética**.

A solução foi pensada para lidar com um problema comum em clínicas de estética, dermatologia e harmonização facial: o recebimento de fotos clínicas de “antes e depois” em condições muito diferentes de iluminação, contraste, fundo e enquadramento.

Muitas vezes, essas imagens chegam:

- escuras demais;
- claras demais;
- com contraste ruim;
- com sombras fortes;
- com reflexos;
- com fundo poluído;
- com enquadramento inconsistente.

Isso dificulta:

- a comparação visual;
- a organização do acervo;
- a padronização dos registros;
- o tratamento automatizado das imagens.

O objetivo do projeto é, portanto, criar um sistema capaz de:

1. receber imagens unitárias ou em lote;
2. analisar a qualidade visual inicial de cada imagem;
3. identificar quais imagens já estão adequadas;
4. corrigir automaticamente imagens recuperáveis;
5. verificar se a imagem tem viabilidade para segmentação;
6. segmentar quando houver confiança suficiente;
7. encaminhar para revisão humana os casos complexos.

---

## 2. Ideia principal do projeto

A ideia principal do projeto é:

> automatizar a triagem e o tratamento inicial de fotos clínicas, melhorando imagens recuperáveis e separando para revisão humana os casos complexos.

Ou seja, o foco do projeto **não é apenas equalizar imagens** e nem **apenas segmentar imagens**.

O verdadeiro foco é a **tomada de decisão automática**.

O sistema precisa responder, sozinho, perguntas como:

- a imagem já está boa?
- a imagem está ruim, mas pode ser recuperada?
- a imagem é complexa demais para confiar no processamento automático?
- a imagem pode ser segmentada com segurança?
- a imagem deve ser aprovada ou revisada manualmente?

---

## 3. O que o projeto não é

Para não desalinhar a proposta, é importante deixar claro que o projeto **não é**:

- um editor estético de imagem;
- um software de diagnóstico;
- um sistema que substitui avaliação profissional;
- um pipeline de segmentação médica precisa;
- uma triagem manual feita antes do algoritmo.

A triagem deve acontecer **dentro do motor**, de forma automática.

---

## 4. Proposta de valor

A proposta de valor da solução pode ser resumida assim:

> Automatize a triagem e o tratamento inicial das fotos clínicas do antes e depois.

Ou ainda:

> Padronize imagens, reduza o retrabalho da equipe e identifique automaticamente os casos que exigem revisão humana.

---

## 5. Valor real para o cliente

O cliente final não está comprando uma máscara binária ou uma equalização de histograma.

O valor real da solução está em:

- triagem automatizada;
- padronização visual;
- correção técnica básica de imagens recuperáveis;
- separação segura de imagens problemáticas;
- ganho de tempo da equipe;
- melhor organização do portfólio clínico;
- redução de esforço manual na análise inicial.

Portanto, o retorno mais importante da ferramenta para o usuário é algo como:

- **Imagem aprovada**
- **Imagem corrigida automaticamente**
- **Imagem pronta para comparação/padronização**
- **Imagem clínica complexa: requer revisão humana**

A segmentação pode existir como artefato técnico e apoio visual, mas **não precisa ser o principal produto final comercial**.

---

## 6. Público-alvo

A solução é voltada para:

- clínicas de estética;
- consultórios dermatológicos;
- profissionais de harmonização facial;
- centros de estética corporal;
- franquias de procedimentos estéticos;
- equipes que organizam registros fotográficos clínicos.

---

## 7. Dataset: conceito correto

O dataset deve conter, no mínimo, **12 imagens**, divididas em três grupos.

### 7.1 Imagens ideais

Devem apresentar:

- boa iluminação;
- contraste equilibrado;
- fundo limpo ou neutro;
- enquadramento favorável;
- região do rosto/pele bem visível.

Essas imagens representam registros prontos para processamento automático.

### 7.2 Imagens com problemas, mas recuperáveis

Devem apresentar:

- leve subexposição;
- leve superexposição;
- contraste moderadamente ruim;
- sombras perceptíveis;
- brilho inadequado;
- visibilidade ainda preservada.

Essas imagens representam casos que o sistema pode tentar corrigir automaticamente.

Ponto importante:

> essas imagens devem parecer ruins, mas ainda recuperáveis.

Se estiverem extremas demais, o algoritmo não vai recuperar; vai apenas reprovar ou encaminhar para revisão humana.

### 7.3 Imagens complexas

Devem apresentar:

- fundo poluído;
- iluminação irregular;
- reflexos;
- sombras fortes;
- múltiplos elementos na cena;
- enquadramento inconsistente;
- baixa confiabilidade para segmentação automática.

Essas imagens representam os casos que provavelmente exigirão **revisão humana**.

---

## 8. Regra mais importante sobre o dataset

As imagens devem entrar no sistema **misturadas**.

Ou seja:

- o grupo não deve ser separado manualmente antes do processamento;
- o motor é quem deve descobrir sozinho se a imagem é ideal, adequada, recuperável ou complexa.

Isso está alinhado com a exigência de um processamento **100% automatizado**, sem ajuste manual por imagem.

---

## 9. Papel dos algoritmos no projeto

### 9.1 Equalização de histograma

A equalização serve para melhorar a distribuição tonal da imagem.

Ela é útil principalmente quando a imagem está:

- escura demais;
- clara demais;
- com baixo contraste.

No projeto, ela deve ser vista como:

> uma tentativa de recuperação automática.

Ela **não é o objetivo final**, e não garante deixar a imagem “perfeita”.

Ela apenas tenta deixar a imagem:

- mais visível;
- mais legível;
- mais adequada para a etapa seguinte.

### 9.2 Bimodalidade

A bimodalidade está relacionada ao comportamento do histograma.

Quando o histograma tem dois picos principais, isso pode indicar duas classes relativamente separáveis, como:

- fundo;
- região de interesse.

No projeto, a bimodalidade faz sentido como **indício de viabilidade de segmentação**.

### 9.3 Método de Otsu

O método de Otsu serve para encontrar um limiar que maximize a separação entre classes.

Além de ajudar na limiarização, ele também pode ser usado para medir:

- separabilidade;
- confiança da segmentação;
- viabilidade do processamento automático.

### 9.4 Limiarização binária

A limiarização binária transforma a imagem em duas classes, normalmente:

- preto;
- branco.

Ela permite uma segmentação simples, separando pixels acima e abaixo de um limiar.

### 9.5 Segmentação

Segmentar significa:

> destacar, separar ou isolar a região principal da imagem em relação ao fundo.

No contexto do projeto, a segmentação pode servir para:

- apoiar a triagem;
- evidenciar que a imagem estava adequada;
- gerar uma saída visual complementar;
- reduzir interferência do fundo;
- apoiar a padronização do “antes e depois”.

Ela **não precisa ser o produto final principal** do sistema.

---

## 10. Lógica correta do motor

O motor deve funcionar em etapas.

### 10.1 Etapa 1 — análise inicial

O sistema deve analisar cada imagem e responder se ela apresenta problemas básicos de qualidade, como:

- muito escura;
- muito clara;
- baixo contraste;
- estouro em branco ou preto;
- possível baixa nitidez;
- possível cena inadequada.

Métricas possíveis:

- histograma;
- média de intensidade;
- desvio padrão;
- percentuais de pixels em extremos tonais;
- variância do Laplaciano;
- medidas de separabilidade.

### 10.2 Etapa 2 — correção automática

Se a imagem estiver ruim, mas parecer recuperável, o sistema tenta corrigir.

Exemplos de correção:

- equalização de histograma;
- preferencialmente CLAHE;
- ajuste no canal de luminância;
- correção moderada e controlada.

### 10.3 Etapa 3 — validação da correção

O sistema não deve assumir que toda correção foi boa.

Ele deve verificar se a versão corrigida:

- realmente melhorou;
- não ficou artificial;
- não perdeu textura;
- não ficou mais lavada;
- não piorou o aspecto visual.

Se não houver ganho real, a correção deve ser:

- descartada;
- mantida apenas como tentativa sem ganho relevante;
- ou a imagem deve ser encaminhada para revisão humana.

### 10.4 Etapa 4 — viabilidade de segmentação

Depois da aprovação ou correção, o sistema deve verificar:

- se há separação suficiente entre região de interesse e fundo;
- se a segmentação automática é confiável;
- se a imagem possui separabilidade suficiente.

Aqui entram:

- Otsu;
- separabilidade;
- comportamento do histograma;
- decisão binária de viabilidade.

### 10.5 Etapa 5 — ação final

Se a imagem estiver adequada:

- o sistema segmenta;
- salva os artefatos;
- aprova o processamento.

Se a imagem não estiver adequada ou não houver confiança:

- o sistema emite alerta;
- classifica como revisão humana.

---

## 11. Classificações recomendadas

Uma estrutura de classificação mais madura para o projeto é:

- **ideal**
- **adequada**
- **corrigida_automaticamente**
- **ajuste_sem_ganho_relevante**
- **requer_revisao_humana**

### 11.1 Ideal
Imagem com:

- boa iluminação;
- bom contraste;
- boa separabilidade;
- fundo mais limpo;
- sem necessidade de correção.

### 11.2 Adequada
Imagem boa para processamento, mas não necessariamente “perfeita” em padronização clínica.

### 11.3 Corrigida automaticamente
Imagem que apresentava problema técnico simples, mas melhorou com o ajuste automático.

### 11.4 Ajuste sem ganho relevante
Imagem em que o sistema tentou corrigir, mas a melhora foi inexistente ou irrelevante.

### 11.5 Requer revisão humana
Imagem complexa, artificialmente degradada ou com baixa confiança para processamento automático.

---

## 12. O que significa “melhorar automaticamente”

Melhorar automaticamente **não significa embelezar** a imagem.

Significa corrigir problemas técnicos básicos, como:

- brilho inadequado;
- contraste ruim;
- distribuição tonal ruim;
- dificuldade leve de leitura visual.

Na prática, isso quer dizer:

- tentar deixar a imagem mais legível;
- melhorar a visibilidade da região principal;
- facilitar comparação;
- apoiar organização e padronização.

---

## 13. O que fazer com a imagem segmentada

A imagem segmentada pode ser usada como:

- apoio técnico interno;
- prova visual de que a imagem estava segmentável;
- recurso complementar de apresentação;
- auxílio para padronização visual.

Ela não precisa ser o retorno mais importante para o cliente final.

O cliente final se beneficia mais de algo como:

- aprovada;
- corrigida;
- não corrigível;
- revisão humana.

---

## 14. Por que algumas imagens visualmente “bonitas” falham

Ao longo do desenvolvimento, foi observado que algumas imagens, especialmente com aparência muito suave ou geradas por IA, podem:

- parecer boas para o olho humano;
- ter fundo e pele com tons muito parecidos;
- ter iluminação suave demais;
- ter pouco contraste local;
- ter baixa separabilidade para Otsu.

Nesses casos, o sistema pode classificar a imagem como inadequada para segmentação, mesmo que visualmente ela pareça “bonita”.

Isso não significa que o problema é “ser IA”.

Significa que a imagem pode não ter:

- contraste suficiente;
- separação tonal suficiente;
- bordas suficientemente marcadas;
- histograma favorável para segmentação binária.

---

## 15. Casos problemáticos observados

### 15.1 Equalização sem diferença perceptível

Em algumas imagens, a versão equalizada ficou quase igual à original.

Interpretação correta:

- o sistema aplicou correção sem ganho visual relevante;
- a imagem provavelmente já era adequada;
- o motor não deveria vender isso como grande melhoria.

### 15.2 Equalização que piora a imagem

Em alguns casos, a equalização:

- deixou a imagem lavada;
- removeu textura;
- suavizou demais a pele;
- reduziu a fidelidade visual.

Interpretação correta:

- a imagem não foi bem tratada;
- o ajuste foi agressivo ou inadequado;
- o motor precisa validar ganho real antes de aceitar a correção.

### 15.3 Imagem muito clara indo para revisão humana

Em casos muito claros, o sistema pode:

- acertar ao perceber o problema;
- falhar ao tentar corrigi-lo;
- concluir corretamente que a imagem não ficou boa para segmentação.

---

## 16. Arquitetura recomendada

O projeto pode ficar em monorepo sem problema.

A recomendação é separar as responsabilidades de forma conceitual:

### 16.1 Camada 1 — motor técnico
Responsável por:

- análise de qualidade;
- correção;
- validação;
- segmentação;
- classificação;
- relatórios.

### 16.2 Camada 2 — notebook / Colab
Responsável por:

- demonstrar tecnicamente o motor;
- servir como entrega acadêmica;
- permitir testes com imagem unitária e em lote;
- exibir os artefatos e métricas.

### 16.3 Camada 3 — landing page
Responsável por:

- apresentar o produto como solução comercial;
- comunicar o problema e a proposta de valor;
- mostrar benefícios;
- exibir exemplos e, idealmente, uma demo.

---

## 17. Estrutura sugerida de pastas

```text
projeto/
├── app/
├── motor/
│   ├── config.py
│   ├── io.py
│   ├── quality.py
│   ├── segment.py
│   ├── pipeline.py
│   ├── facade.py
│   └── report.py
├── notebooks/
│   └── demo_colab.ipynb
├── data/
│   ├── original/
│   ├── processed/
│   └── review_human/
├── reports/
├── landing/
└── README.md
````

---

## 18. Funções principais recomendadas

Uma fachada em PT-BR ajuda muito na clareza do notebook e da demonstração.

Funções recomendadas:

* `analisar_qualidade(gray)`
* `aplicar_equalizacao(gray)`
* `verificar_viabilidade_segmentacao(gray)`
* `segmentar_imagem(gray, bgr=None)`
* `processar_imagem(caminho_imagem)`
* `processar_lote(pasta_entrada)`
* `gerar_relatorio(pasta_relatorios, resultados)`

Essas funções podem ser wrappers para o pipeline interno.

---

## 19. Exemplo de saída ideal do motor

Cada imagem deve gerar um retorno estruturado, por exemplo:

```text
{
  "arquivo": "...",
  "status_cliente": "corrigida_automaticamente",
  "metricas_originais": {...},
  "metricas_finais": {...},
  "separabilidade_otsu": 0.74,
  "limiar_otsu": 123,
  "artefatos": {
    "orig_color": "...",
    "gray": "...",
    "eq_color": "...",
    "eq": "...",
    "bin": "...",
    "seg_color": "...",
    "seg_crop": "...",
    "review": null
  }
}
```

Importante:

* não devolver caminhos inexistentes;
* se o artefato não existir, retornar `null` / `None`.

---

## 20. Melhorias importantes no motor

### 20.1 Não equalizar tudo

Uma imagem boa não deve ser corrigida desnecessariamente.

### 20.2 Usar correção mais segura

Preferir:

* CLAHE;
* ajuste em luminância;
* correção moderada.

### 20.3 Validar ganho

Só aceitar a imagem corrigida se houver melhoria real.

### 20.4 Separar “adequada” de “ideal”

Uma imagem pode ser:

* boa tecnicamente para processamento;
* mas não perfeita em padrão clínico.

### 20.5 Enriquecer o retorno

Adicionar algo como:

* `status_cliente`
* `needs_equalization`
* `requires_human_review`
* `artefatos`
* `detalhes_validacao`

---

## 21. Colab / notebook: papel e estrutura

O notebook é a entrega técnica e a prova de funcionamento do motor.

### 21.1 O que o notebook deve fazer

* permitir upload de uma imagem;
* permitir upload de várias imagens;
* processar tudo automaticamente;
* exibir resultados com clareza;
* gerar relatório CSV.

### 21.2 Blocos recomendados

1. Introdução do projeto
2. Imports e configuração
3. Upload de imagens
4. Definição ou importação do motor
5. Execução unitária
6. Execução em lote
7. Visualização dos resultados
8. Geração do relatório

### 21.3 O que mostrar por imagem

* imagem original;
* histograma;
* métricas;
* imagem equalizada, se houver;
* imagem segmentada, se houver;
* decisão final.

### 21.4 O que evitar

* lógica espalhada;
* ajuste manual por imagem;
* código repetido;
* decisões baseadas no nome do arquivo.

---

## 22. Landing page: objetivo

A landing page deve apresentar o projeto como um produto SaaS para o mercado de estética.

Ela deve vender:

* triagem automática;
* padronização das fotos;
* correção de casos recuperáveis;
* separação de imagens complexas;
* agilidade operacional;
* organização do “antes e depois”.

Ela **não deve focar demais na técnica bruta**.

O cliente compra benefício operacional, não “um Otsu”.

---

## 23. Estrutura recomendada da landing page

### 23.1 Hero

**EstetiScan AI**
Automatize a triagem e o tratamento inicial das fotos clínicas do antes e depois.

Subheadline:
Padronize imagens, reduza retrabalho e identifique automaticamente os casos que exigem revisão humana.

CTAs:

* Solicitar demonstração
* Testar uma imagem

### 23.2 Seção de problema

Mostrar a dor do cliente:

* fotos escuras;
* fundos poluídos;
* variações de iluminação;
* comparação difícil;
* esforço manual da equipe.

### 23.3 Seção de solução

Explicar que a plataforma:

* analisa as imagens;
* corrige o que for recuperável;
* segmenta quando houver viabilidade;
* separa casos complexos para revisão humana.

### 23.4 Seção de benefícios

* padronização visual;
* economia de tempo;
* melhoria de qualidade técnica;
* triagem inteligente;
* apoio à organização do portfólio clínico;
* redução de retrabalho.

### 23.5 Seção de funcionamento

1. Faça upload de uma imagem ou lote
2. O sistema analisa brilho, contraste e viabilidade
3. Corrige automaticamente quando possível
4. Segmenta quando houver confiança
5. Encaminha casos complexos para revisão humana

### 23.6 Público-alvo

* clínicas de estética;
* dermatologistas;
* harmonização facial;
* centros de estética corporal;
* franquias de estética.

### 23.7 Prova visual

Mostrar exemplos reais do sistema:

* imagem ideal;
* imagem recuperável antes/depois;
* imagem complexa com alerta.

### 23.8 Observação ética

> O sistema não substitui avaliação profissional. Atua como ferramenta de triagem, padronização e apoio visual, respeitando privacidade, consentimento e confidencialidade das imagens.

---

## 24. Demo na landing page

Faz muito sentido incluir uma área de demonstração.

Essa demo pode permitir:

* upload de imagem;
* processamento automático;
* exibição do resultado.

Saída ideal da demo:

* imagem original;
* status;
* imagem corrigida, se houver;
* mensagem de revisão humana, se necessário;
* imagem segmentada como apoio técnico.

A segmentação pode aparecer como retorno complementar.

---

## 25. Mensagem comercial correta

A forma mais forte de apresentar a solução é:

> O EstetiScan AI automatiza a triagem e a padronização inicial de imagens clínicas, corrige casos recuperáveis e separa com segurança os registros que precisam de revisão humana.

Essa mensagem vende muito melhor do que falar apenas em:

* equalização;
* limiarização;
* histograma;
* Otsu.

---

## 26. Critérios de avaliação do trabalho

### 26.1 Lógica automatizada e código

O algoritmo deve:

* analisar histograma;
* identificar imagens inadequadas;
* aplicar equalização quando necessário;
* realizar segmentação condicional;
* separar casos complexos.

### 26.2 Explicação e teoria

O vídeo técnico deve explicar:

* histograma;
* contraste;
* equalização;
* limiarização;
* tomada de decisão automatizada.

### 26.3 Landing page e visão comercial

A página deve:

* apresentar a solução como produto real;
* comunicar benefícios;
* mostrar valor para clínicas;
* exibir exemplos visuais.

### 26.4 Qualidade do dataset

As imagens precisam representar:

* imagens boas;
* imagens ruins recuperáveis;
* imagens complexas;
* casos em que a automação funciona e falha.

---

## 27. Frases prontas úteis para apresentação

### 27.1 Ideia principal

> O projeto busca automatizar a triagem e o tratamento inicial de imagens clínicas, identificando quais fotos já estão adequadas, quais podem ser corrigidas automaticamente e quais precisam de revisão humana.

### 27.2 Papel da equalização

> A equalização de histograma é uma técnica auxiliar usada para tentar recuperar imagens com problemas de iluminação ou contraste, mas não é o objetivo final do sistema.

### 27.3 Papel da segmentação

> A segmentação atua como etapa técnica de apoio, destacando a região principal da imagem e ajudando na decisão automática sobre a viabilidade do processamento.

### 27.4 Limitação importante

> O sistema não substitui avaliação profissional e não realiza diagnóstico; ele atua como ferramenta de triagem, padronização e apoio visual.

### 27.5 Sobre revisão humana

> Quando a imagem apresenta baixa confiabilidade para processamento automático, o sistema a encaminha para revisão humana, evitando resultados inseguros.

---

## 28. Próximos passos recomendados

### 28.1 No motor

* refinar os limiares;
* evitar correção agressiva;
* validar ganho real da equalização;
* padronizar a saída;
* separar “ideal” de “adequada”.

### 28.2 No notebook

* organizar em blocos claros;
* mostrar resultados visuais;
* suportar processamento unitário e em lote;
* gerar relatório CSV.

### 28.3 Na landing page

* melhorar proposta de valor;
* estruturar seções de problema, solução e benefícios;
* incluir exemplos visuais;
* adicionar demo ou mock de demo;
* reforçar ética e profissionalismo.

---

## 29. Resumo executivo final

Este projeto deve ser construído como uma solução com duas grandes camadas:

### Camada 1 — Motor técnico

Responsável por:

* receber imagens;
* analisar automaticamente a qualidade;
* corrigir o que for recuperável;
* verificar viabilidade de segmentação;
* segmentar quando houver confiança;
* encaminhar para revisão humana os casos complexos.

### Camada 2 — Interface de apresentação

Responsável por:

* demonstrar tecnicamente o motor no notebook/Colab;
* apresentar comercialmente a solução na landing page.

---

## 30. Frase final de alinhamento do projeto

> O EstetiScan AI é uma solução de triagem e padronização visual para imagens clínicas, capaz de analisar automaticamente a qualidade das fotos, corrigir casos recuperáveis e encaminhar para revisão humana os registros complexos, apoiando a organização e a consistência do antes e depois.

