# AnaHelo

Sistema de gestão de estoque e vendas desenvolvido com Nuxt 4.

## 📝 Sobre o Sistema

O **AnaHelo** é uma aplicação web voltada para o gerenciamento de estoque, facilitando o controle de compras, vendas e movimentações de produtos. O sistema conta com uma interface moderna e responsiva, oferecendo as seguintes funcionalidades:

- **Controle de Compras**: Registro e acompanhamento de entradas de mercadorias.
- **Gestão de Vendas**: Registro e monitoramento de saídas de produtos.
- **Movimentações de Estoque**: Histórico detalhado de todas as operações no estoque.
- **Cadastro de Produtos**: Gerenciamento completo do catálogo de itens.
- **Gestão de Fornecedores**: Cadastro e manutenção de dados de fornecedores.
- **Administração de Usuários**: Controle de acesso e perfis de usuário.

## 🚀 Tecnologias Utilizadas

- **[Nuxt 4](https://nuxt.com/)**: Framework Vue.js para o desenvolvimento do frontend.
- **[Pinia](https://pinia.vuejs.org/)**: Gerenciamento de estado global da aplicação.
- **[Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)**: Framework de CSS e biblioteca de componentes para uma UI moderna e customizável.
- **Material Icons**: Conjunto de ícones para uma interface intuitiva.

## ⚙️ Configuração e Execução

### Pré-requisitos

- **Node.js**: Recomendado v18 ou superior.
- **npm** ou **pnpm**.

### Instalação

1. Clone este repositório.
2. Na raiz do projeto, instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`.
   - Ajuste a variável `NUXT_PUBLIC_API_BASE` para a URL da API backend.

### Desenvolvimento

Para iniciar o servidor de desenvolvimento com hot-reload:
```bash
npm run dev
```
A aplicação estará acessível em `http://localhost:3000`.

### Build para Produção

Para gerar a versão otimizada para produção:
```bash
npm run build
```

Para visualizar a build de produção localmente:
```bash
npm run preview
```

## 🐳 Docker

Para rodar a aplicação utilizando Docker:

```bash
# Construir a imagem
docker build -t app-anahelo .

# Iniciar o container
docker run -p 3000:3000 app-anahelo
```
