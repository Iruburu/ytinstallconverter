class newApp {
  constructor() {
    // Busca o formulário onde vai ser colocados as URLs
    this.formUrl = document.getElementById("form_url");

    this.buttonFetch = document.getElementById("fetch_List_URLs");

    this.HTMLListURLs = document.getElementById("list_urls");

    // Uma lista onde será guardado as URLs selecionadas
    this.listURLs = [];
  }
}

newApp.prototype.startForm = (event) => {
  // Evitar que a pagina seja atualizada quando o sumit for chamado
  event.preventDefault();

  // Função para pegar os valos preenchidos dentro do formulário
  const getvalues = function (id, clear = true, type = "id") {
    /* Essa função serve para buscar os valores preenchidos dentro do formulário, coms as seguintes ações:
        - Pegar id do formulário, para não haver erro na busca
        - buscar os elemento que foi especificado
        - Pegar o valor preenchido e remover espaços laterais */

    const idForm = app.formUrl.id;
    const search = type == "class" ? `#${idForm} .${id}` : `#${idForm} #${id}`;
    const input = document.querySelector(search);

    // Verifica se o elemento buscado exite e faz tratamento de erros
    if (!input)
      throw new Error(
        "O elemento " +
          id +
          " não foi encontrado. Por favor, verifique o " +
          (type == "class" ? "." + id : "#" + id) +
          " e tente novamente."
      );

    const value = input.value.trim();

    // Faz a limpeza do do elemento que foi buscado
    if (clear) input.value = "";

    // Retorna valor buscado
    return value;
  };

  // Variáveis onde sera guardado os valores buscados
  const inputUrl = getvalues("input_url"); // --> URL
  const methodSelected = getvalues("method_selected", false); // --> Tipo de arquivo

  // Objeto interativo da nova URL
  const url = new app.newUrl(inputUrl, methodSelected);

  // Adiciona a URl á lista
  app.listURLs.push(url);

  app.drawListURLs();
};

newApp.prototype.newUrl = class {
  constructor(url, method) {
    this.index = app.listURLs.length;

    this.URL = url;

    this.method = method;
  }

  edit() {
    return false;
  }
};

newApp.prototype.startApp = () => {
  app.formUrl.addEventListener("submit", app.startForm);
};

newApp.prototype.createTableRow = (data) => {
  // faz a descontrusção do objeto
  const { index, URL, method } = data;

  // Criar elementos
  const tr = document.createElement("tr");
  tr.classList.add("url", "grid");

  const tdIndex = document.createElement("td");
  tdIndex.classList.add("index");
  tdIndex.textContent = index;

  const tdUrl = document.createElement("td");
  tdUrl.classList.add("url");
  tdUrl.textContent = URL;

  const tdExt = document.createElement("td");
  tdExt.classList.add("ext");
  tdExt.textContent = method;

  const tdRemove = document.createElement("td");
  tdRemove.classList.add("Bu-remove");
  tdRemove.setAttribute("value", index);

  tdRemove.addEventListener("click", () => app.deleteToUrl(index, tdRemove));

  // Adicionar elementos ao <tr>
  tr.appendChild(tdIndex);
  tr.appendChild(tdUrl);
  tr.appendChild(tdExt);
  tr.appendChild(tdRemove);

  return tr;
};

// Responsável por desenhar a lista de URLs dentro de uma tabela
newApp.prototype.drawListURLs = (urls = app.listURLs) => {
  // Limpa as listas antigas para desenhar a lista atualizada
  app.HTMLListURLs.innerHTML = "";

  // Lista onde serão guardadas as células formadas
  const listTables = [];

  // Itera com forEach na lista principal de URLs e chama a função que cria as células e as guarda na lista de células
  urls.forEach((url) => listTables.push(app.createTableRow(url)));

  // Itera sobre a lista de células e insere tudo na tabela HTML
  listTables.reverse().forEach((newTable) => {
    app.HTMLListURLs.appendChild(newTable);
  });
};

// Responsável por fazer a limpeza de URLs que o usuário não quer instalar
newApp.prototype.deleteToUrl = (index, tdRemove) => {
  // Atalho para a lista principal de URLs
  const listUrls = app.listURLs;

  // Verifica o número da URL na lista que o usuário quer deletar e, em seguida, a remove da lista e da tabela. Com as seguintes execuções:
  //  - Usa um forEach para iterar sobre a lista principal de URLs
  //  - Verifica em que posição está a URL desejada na lista principal
  //  - Remove a URL desejada da lista
  //  - Redesenha a lista atualizada.

  listUrls.forEach((data, i) => {
    if (index + 1 <= data.index) listUrls[i].index -= 1;
  });

  // Remove a URL desejada da lista
  app.listURLs.splice(index, 1);

  // Redesenha a lista atualizada.
  app.drawListURLs();

  // Remove os eventos de clique.
  tdRemove.removeEventListener("click", () => null);
};

const app = new newApp();

app.startApp();
