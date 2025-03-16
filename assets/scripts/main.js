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

  app.drawListURLs(app.listURLs);
};

newApp.prototype.newUrl = class {
  constructor(url, method) {
    this.index = app.listURLs.length + 1;

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

  tdRemove.addEventListener("click", function () {
    app.deleteToUrl(index)
    tr.remove();
  });

  // Adicionar elementos ao <tr>
  tr.appendChild(tdIndex);
  tr.appendChild(tdUrl);
  tr.appendChild(tdExt);
  tr.appendChild(tdRemove);

  return tr;
};

newApp.prototype.drawListURLs = (urls) => {
  app.HTMLListURLs.innerHTML = "";

  const listTables = []

  urls.forEach((url) => 
    listTables.push(app.createTableRow(url)));

  listTables.reverse().forEach((newTable) => {
    app.HTMLListURLs.appendChild(newTable);
  });
};

newApp.prototype.deleteToUrl = (index) => {

}

const app = new newApp();

app.startApp();
