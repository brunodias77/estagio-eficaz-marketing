const url_atual = window.location.href;
if (url_atual.includes("/listaCadastrados.html")) {
  fetch("https://estagio.eficazmarketing.com/api/user")
    .then((response) => response.json())
    .then((json) => dataApi(json));
}
if (url_atual.includes("/cadastrar.html")) {
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get("id")) {
    //Funções para a pagina de cadastro, para editar um usuario.
    async function getUser(id) {
      const response = await fetch(
        `https://estagio.eficazmarketing.com/api/user/${id}`
      );
      const json = await response.json();
      const inputs = document.querySelectorAll("input");
      const arrayInputs = [...inputs];
      arrayInputs.forEach((element) => {
        element.value = json[`${element.name}`];
      });
    }
    const id = urlParams.get("id");
    getUser(id);
    const button = document.querySelector("#button_form");
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const inputs = document.querySelectorAll("input");
      const array = [...inputs];
      let dados = {};
      array.map((element) => {
        dados[`${element.name}`] = element.value;
      });
      const response = await fetch(
        `https://estagio.eficazmarketing.com/api/user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(dados),
        }
      );
      const resContent = await response.json();
      if (resContent) {
        alert(resContent.message);
        window.location.replace("/");
      }
    });
  } else {
    //Funções para a pagina de cadastro, para adicionar um novo usuario.
    const button = document.querySelector("#button_form");
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const inputs = document.querySelectorAll("input");
      const array = [...inputs];
      let dados = {};
      array.map((element) => {
        dados[`${element.name}`] = element.value;
      });
      const response = await fetch(
        "https://estagio.eficazmarketing.com/api/user",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
        }
      );
      const conteudo = await response.json();
      if (conteudo) {
        alert(conteudo.message);
        window.location.replace("/");
      }
    });
  }
}

async function excluir(id) {
  const response = await fetch(
    `https://estagio.eficazmarketing.com/api/user/${id}`,
    {
      method: "DELETE",
    }
  );
  const conteudo = await response.json();
  if (conteudo) {
    alert(conteudo.message);
    window.location.reload();
  }
}

function dataApi(json) {
  const tBody = document.querySelector(".tabela tbody");
  json.map((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${element.nome}</td>
      <td>${element.seu_email}</td>
      <td>${element.rua}, ${element.numero} ${element.bairro} ${element.cep} ${element.cidade}-${element.uf}</td>
      <td>${element.telefone}</td>
      <td>
        <div class="buttons_table">
          <button onclick="edit(${element.id})">Alterar</button>
          <button onclick="excluir(${element.id})">Excluir</button>
        </div>
      </td>
    `;
    tBody.appendChild(tr);
    return true;
  });
}

function edit(id) {
  window.location.replace(`/cadastrar.html?id=${id}`);
}
