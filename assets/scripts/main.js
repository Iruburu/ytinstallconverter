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
  // Construtor da classe que cria um novo objeto de URL com os parâmetros 'url' e 'method'
  constructor(url, method) {
    // Atribui ao índice o comprimento atual da lista de URLs (baseado na quantidade de URLs na lista)
    this.index = app.listURLs.length;

    // Atribui o valor da URL passada como argumento ao atributo 'URL'
    this.URL = url;

    // Atribui o valor do método passado como argumento ao atributo 'method'
    this.method = method;
  }

  // Método de edição, atualmente não implementado (retorna sempre 'false')
  edit() {
    return false;
  }
};

newApp.prototype.startApp = () => {
  app.formUrl.addEventListener("submit", app.startForm);
};

// Cria e retorna um objeto tipo HTMLContent com os dados da url adicionado
newApp.prototype.createTableRow = (data) => {
  // Desestrutura o objeto 'data' para acessar as propriedades: index, URL e method
  const { index, URL, method } = data;

  // Cria um novo elemento de linha (<tr>) para a tabela
  const tr = document.createElement("tr");
  tr.classList.add("url", "grid"); // Adiciona as classes CSS 'url' e 'grid' à linha

  // Cria a célula para o índice da URL
  const tdIndex = document.createElement("td");
  tdIndex.classList.add("index"); // Adiciona a classe CSS 'index' à célula
  tdIndex.textContent = index; // Define o conteúdo da célula como o índice da URL

  // Cria a célula para a URL
  const tdUrl = document.createElement("td");
  tdUrl.classList.add("url"); // Adiciona a classe CSS 'url' à célula
  tdUrl.textContent = URL; // Define o conteúdo da célula como a URL

  // Cria a célula para o método associado à URL
  const tdExt = document.createElement("td");
  tdExt.classList.add("ext"); // Adiciona a classe CSS 'ext' à célula
  tdExt.textContent = method; // Define o conteúdo da célula como o método associado

  // Cria a célula para o botão de remoção
  const tdRemove = document.createElement("td");
  tdRemove.classList.add("Bu-remove"); // Adiciona a classe CSS 'Bu-remove' à célula
  tdRemove.setAttribute("value", index); // Atribui o índice como um atributo 'value' da célula

  // Adiciona o evento de clique na célula de remoção
  tdRemove.addEventListener("click", () => app.deleteToUrl(index, tdRemove));

  // Adiciona todas as células criadas à linha (<tr>)
  tr.appendChild(tdIndex);
  tr.appendChild(tdUrl);
  tr.appendChild(tdExt);
  tr.appendChild(tdRemove);

  // Retorna a linha (<tr>) formada com todas as células
  return tr;
};

// Responsável por desenhar a lista de URLs dentro de uma tabela HTML
newApp.prototype.drawListURLs = (urls = app.listURLs) => {
  // Limpa a tabela existente para desenhar a lista atualizada de URLs
  app.HTMLListURLs.innerHTML = "";

  // Lista que armazenará as células da tabela que serão geradas
  const listTables = [];

  // Itera sobre a lista de URLs e cria as células de tabela para cada URL
  urls.forEach((url) => listTables.push(app.createTableRow(url)));

  // Inverte a ordem das células (se necessário) e adiciona elas à tabela HTML
  listTables.reverse().forEach((newTable) => {
    app.HTMLListURLs.appendChild(newTable);
  });
};

// Responsável por excluir uma URL que o usuário não deseja manter
newApp.prototype.deleteToUrl = (index, tdRemove) => {
  // Atalho para a lista principal de URLs
  const listUrls = app.listURLs;

  // Ajusta o índice das URLs seguintes à URL deletada
  // Itera sobre a lista de URLs e decrementa o índice das URLs após a excluída
  listUrls.forEach((data, i) => {
    if (index + 1 <= data.index) listUrls[i].index -= 1;
  });

  // Remove a URL da lista principal de URLs usando o índice
  app.listURLs.splice(index, 1);

  // Redesenha a tabela com a lista de URLs atualizada
  app.drawListURLs();

  // Remove o evento de clique da célula removida
  tdRemove.removeEventListener("click", () => null);
};

// Define um método assíncrono verifyUrl no prototype de newApp
newApp.prototype.verifyUrl = async (url) => {
  // Mensagem de erro caso a URL não seja válida
  const AlertError = "Url Inserida não é valida! Verifique e tente novamente.";

  // Expressão regular para validar URLs do YouTube (suporta diferentes formatos)
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|playlist\?list=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11,})/;

  // Se a URL não corresponder ao padrão do YouTube, lança um erro
  if (!youtubeRegex.test(url)) throw new Error(AlertError);

  // Função assíncrona para buscar informações do vídeo usando a API NoEmbed
  const noembed = async function(_url) {
    try {
      // Faz a requisição para a API NoEmbed passando a URL do YouTube
      const response = await fetch(`https://noembed.com/embed?url=${_url}`);

      // Se a resposta não for bem-sucedida, lança um erro
      if (!response.ok) throw new Error("Erro na requisição da API");

      // Converte a resposta para JSON e retorna os dados
      const data = await response.json();
      return data;
    } catch (error) {
      // Captura e lança um erro caso algo dê errado na requisição
      throw new Error("Ooops:" + error);
    }
  };

  // Aguarda a resposta da função noembed() e armazena os dados do vídeo
  const result = await noembed(url);

  // Se não houver resultado válido, lança um erro
  if (!result || result.error) throw new Error(AlertError);

  // Retorna os dados do vídeo obtidos da API NoEmbed
  return result;
};

const app = new newApp();

app.startApp();