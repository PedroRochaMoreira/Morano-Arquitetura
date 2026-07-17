# 📐 SKEngenharia — Documentação Técnica: Seção de Projetos (Portfólio)

> Documento gerado para onboarding de dev parceiro.  
> Stack: **Angular 17+** (frontend) · **ASP.NET Core** (API) · **Vanilla CSS**

---

## 🗂️ Estrutura de Dados — Interface `Project`

**Arquivo:** `frontend/src/app/app.ts`

```typescript
export interface Project {
  id: string;       // identificador único (slug), ex: 'galpao-industrial'
  title: string;    // nome completo do projeto
  category: string; // categoria, ex: 'Construção Industrial'
  location: string; // cidade/estado, ex: 'Apucarana - PR'
  images: string[]; // array com todos os caminhos das fotos
  thumb: string;    // caminho da foto de capa exibida no card
}
```

---

## 📋 Array `projects` — Dados dos Projetos

**Arquivo:** `frontend/src/app/app.ts` — linhas 50–264

O portfólio é **hardcoded** (sem banco de dados). São **20 projetos reais** da empresa definidos diretamente no componente.

### Exemplo de projeto:

```typescript
{
  id: 'galpao-industrial',
  title: 'Galpão Industrial 950m²',
  category: 'Construção Industrial',
  location: 'Apucarana - PR',
  images: [
    'repertorio/Gal1.jpeg',
    'repertorio/Gal2.jpeg',
    'repertorio/Gal3.jpeg',
    'repertorio/Gal4.jpeg',
    'repertorio/Gal5.jpeg',
  ],
  thumb: 'repertorio/Gal5.jpeg',
}
```

### 📁 Onde ficam as imagens?

As fotos estão em:

```
frontend/public/repertorio/
```

Servidas como assets estáticos pelo Angular CLI. Referenciadas **sem** o prefixo `public/` nas strings (ex: `'repertorio/Gal1.jpeg'`).

---

## 🖼️ Renderização no HTML — Portfolio Grid

**Arquivo:** `frontend/src/app/app.html` — linhas 248–264

```html
<section id="portfolio" class="sk-portfolio">
  <div class="portfolio-grid">

    @for (proj of projects; track proj.id) {
      <div class="p-card" (click)="openLightbox(proj)" data-cursor>

        <!-- Foto de capa -->
        <img [src]="proj.thumb" [alt]="proj.title" loading="lazy">

        <!-- Overlay escuro no hover -->
        <div class="p-card-overlay"></div>

        <!-- Informações do projeto -->
        <div class="p-card-info">
          <small>{{ proj.category }}</small>
          <h3>{{ proj.title }}</h3>
          <p>{{ proj.location }}</p>
          <span class="p-card-count">
            {{ proj.images.length }} foto{{ proj.images.length > 1 ? 's' : '' }}
          </span>
        </div>

      </div>
    }

  </div>
</section>
```

> ⚠️ O `@for` é a **nova sintaxe de loop do Angular 17+** (control flow). Não usa mais `*ngFor`.

---

## 🔍 Lightbox — Visualização das Fotos

**Arquivos:** `app.ts` (lógica) · `app.html` linhas 271–309 (template)

### Estado (signals do Angular)

```typescript
lightboxOpen    = signal(false);               // controla visibilidade
lightboxProject = signal<Project | null>(null); // projeto ativo
lightboxIndex   = signal(0);                   // índice da foto atual
```

### Métodos de controle

| Método | Descrição |
|--------|-----------|
| `openLightbox(project)` | Abre o lightbox com o projeto clicado, iniciando na foto 0 |
| `closeLightbox()` | Fecha e limpa o estado; restaura scroll do body |
| `lightboxNext()` | Avança foto (loop circular) |
| `lightboxPrev()` | Volta foto (loop circular) |
| `setLightboxIndex(i)` | Vai direto para a foto pelo índice (usado nas miniaturas) |

### Navegação por teclado

Via `@HostListener('window:keydown')`:

```typescript
@HostListener('window:keydown', ['$event'])
onKey(e: KeyboardEvent) {
  if (!this.lightboxOpen()) return;
  if (e.key === 'Escape')     this.closeLightbox();
  if (e.key === 'ArrowRight') this.lightboxNext();
  if (e.key === 'ArrowLeft')  this.lightboxPrev();
}
```

### Template do Lightbox (simplificado)

```html
@if (lightboxOpen() && lightboxProject()) {
  <div class="lightbox-overlay" (click)="closeLightbox()">
    <div class="lightbox-panel" (click)="$event.stopPropagation()">

      <!-- Header com título e botão fechar -->
      <div class="lightbox-header"> ... </div>

      <!-- Imagem principal + botões prev/next -->
      <div class="lightbox-img-wrap">
        <img [src]="lightboxProject()!.images[lightboxIndex()]">
        <button (click)="lightboxPrev()">‹</button>
        <button (click)="lightboxNext()">›</button>
        <div class="lb-counter">{{ lightboxIndex() + 1 }} / {{ lightboxProject()!.images.length }}</div>
      </div>

      <!-- Miniaturas clicáveis (só aparece se tiver > 1 foto) -->
      @if (lightboxProject()!.images.length > 1) {
        <div class="lightbox-thumbs">
          @for (img of lightboxProject()!.images; track img; let i = $index) {
            <button [class.active]="i === lightboxIndex()" (click)="setLightboxIndex(i)">
              <img [src]="img" loading="lazy">
            </button>
          }
        </div>
      }

    </div>
  </div>
}
```

---

## 🔄 Fluxo Completo

```
Array projects[] (definido no app.ts)
        ↓
  @for loop no HTML
        ↓
  Grid de cards renderizada (thumb + info)
        ↓
  Usuário clica num card
        ↓
  openLightbox(proj) → atualiza signals
        ↓
  Lightbox abre com:
    ├── Foto principal (navegável com ←/→ ou teclado)
    ├── Contador "X / Total"
    └── Miniaturas clicáveis na parte inferior
        ↓
  Fechar via Esc, botão ✕ ou clique no overlay
```

---

## ➕ Como Adicionar um Novo Projeto

1. Copie as fotos para `frontend/public/repertorio/`
2. Adicione um novo objeto ao array `projects` em `app.ts`:

```typescript
{
  id: 'slug-unico-do-projeto',         // obrigatório e único
  title: 'Nome do Projeto',
  category: 'Categoria',
  location: 'Cidade - UF',
  images: [
    'repertorio/NomeFoto1.jpeg',
    'repertorio/NomeFoto2.jpeg',
  ],
  thumb: 'repertorio/NomeFoto1.jpeg',  // foto que aparece no card
},
```

3. Salve. O Angular recompila e o projeto aparece automaticamente no grid e no lightbox.

---

## 📌 Observações Técnicas

- **Sem API para projetos:** o portfólio é totalmente estático. A API (`SkEngenharia.Api`) só é usada para o formulário de contato (`/api/contact`).
- **Angular Signals:** o projeto usa a API reativa moderna (`signal()`) do Angular 17, sem RxJS nos estados locais.
- **Lazy loading:** todas as imagens do grid usam `loading="lazy"` para performance.
- **CSS das cards:** estilos da grid e do lightbox estão em `frontend/src/styles.css`.

---

*Documentação gerada em 2026-06-26 · SKEngenharia · Desenvolvido por [VTX](https://www.vtxtec.com)*
