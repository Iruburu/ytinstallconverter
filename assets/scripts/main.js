// Busca o formulário onde vai ser colocados as URLs
const formUrl = document.getElementById('form_url')

const buttonFetch = document.getElementById('fetch_List_URLs')

// Uma lista onde será guardado as URLs selecionadas
const listURLs = []

// Funcção para um novo objeto interativo para melhor manuzeio da URL
class NewUrl {
    constructor(url, method) {
        this.number = listURLs.length + 1
        this.URL = url
        this.method = method
    }

    edit() {
        return false
    }
}

// Função Listener interavel pelo formUrl que é executado quando um submit é chamado
formUrl.addEventListener("submit", function (event) {

    // Evitar que a pagina seja atualizada quando o sumit for chamado
    event.preventDefault()

    // Função para pegar os valos preenchidos dentro do formulário
    const getvalues = function (id, type = 'id') {

        /* Essa função serve para buscar os valores preenchidos dentro do formulário, coms as seguintes ações:
            - Pegar id do formulário, para não haver erro na busca
            - buscar os elemento que foi especificado
            - Pegar o valor preenchido e remover espaços laterais */

        const idForm = formUrl.id
        const search = type == 'class' ? `#${idForm} .${id}` : `#${idForm} #${id}`
        const input = document.querySelector(search)

        // Verifica se o elemento buscado exite e faz tratamento de erros
        if (!input) throw new Error(
            "O elemento " + id + " não foi encontrado. Por favor, verifique o " +
            (type == 'class' ? '.' + id : '#' + id) + " e tente novamente."
        )

        const value = input.value.trim()

        // Faz a limpeza do do elemento que foi buscado
        input.value = ''

        // Retorna valor buscado
        return value
    }

    // Variáveis oned sera guardado os valores buscados
    const inputUrl = getvalues("input_url") // --> URL
    const methodSelected = getvalues("method_selected") // --> Tipo de arquivo

    console.log(methodSelected)

    // Objeto interativo da nova URL
    const url = new NewUrl(inputUrl, methodSelected)

    // Adiciona a URl á lista
    listURLs.push(url)
    console.log(listURLs)
})


async function fetchData(url, data, method = 'POST') {

    const body = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    try {
        let response = await fetch(url, body);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + 
                response.statusText
            );
        }
        let data = await response.json()
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error)
    }
}

buttonFetch.addEventListener('click', function(event) {
    fetchData("http://localhost:1313/api/", listURLs)
})