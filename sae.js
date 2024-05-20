let apiURL = "https://thunderbolt-qgjf.onrender.com";
let perguntas;
let PerguntasDados;
let video = false;
var originalSend = XMLHttpRequest.prototype.send;
let criticalData = {};
let apionline = false;
let apionlinewait = () => {
  return new Promise((r) =>
    setInterval(() => {
      if (apionline) r();
    }, 10)
  );
};
setInterval(() => {
  fetch(apiURL)
    .then((res) => res.json())
    .then(() => {
      apionline = true;
    });
}, 3000);

function injectScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Function to inject CSS into the head of the page
function injectCSS(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

const sweetAlertScriptUrl =
  "https://cdn.jsdelivr.net/npm/sweetalert2@11.10.6/dist/sweetalert2.all.min.js";
const sweetAlertCssUrl =
  "https://cdn.jsdelivr.net/npm/sweetalert2@11.10.6/dist/sweetalert2.min.css";
const notiflixCssUrl =
  "https://cdn.jsdelivr.net/npm/notiflix@3.2.7/src/notiflix.min.css";
const notiflixJsUrl =
  "https://cdn.jsdelivr.net/npm/notiflix@3.2.7/dist/notiflix-aio-3.2.7.min.js";
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
function regQuest(id, ans, name) {
  const endpoint =
    apiURL +
    "/questions/register/" +
    criticalData.teamId +
    "/" +
    criticalData.lpiid +
    "/" +
    id +
    "/" +
    ans;
  // Use the fetch API to make the GET request
  return new Promise((r) => {
    fetch(endpoint)
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse the JSON response body
        return response.json();
      })
      .then((data) => {
        Notiflix.Notify.warning(
          "A resposta correta foi detectada e salva no servidor para a questão " +
            name
        );
        r();
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        r();
        console.error("There was a problem with your fetch operation:", error);
      });
  });
}
function extractTeamIdFromUrl() {
  const url = window.location.href;
  var queryString = url.split("?")[1];
  var teamId = null;
  if (queryString) {
    var queryParams = queryString.split("&");
    for (var i = 0; i < queryParams.length; i++) {
      var pair = queryParams[i].split("=");
      var key = pair[0];
      var value = pair[1];
      if (key === "teamId") {
        criticalData.teamId = parseInt(value);
        break;
      }
    }
  }

  return teamId;
}
extractTeamIdFromUrl();
function unshuffle(order, array) {
  let unshuffled = new Array(array.length);

  for (let i = 0; i < order.length; i++) {
    unshuffled[order[i]] = array[i];
  }

  return unshuffled;
}

XMLHttpRequest.prototype.send = function (body) {
  var self = this;

  async function onReadyStateChange() {
    if (
      self.readyState === XMLHttpRequest.DONE &&
      self._url.includes("apis.sae.digital/ava/escola-digital/jarvis/trilha") &&
      self._method === "GET" &&
      getCookie("userToken")
    ) {
      perguntas = JSON.parse(self.responseText);
      if (perguntas.video_data) video = true;
      criticalData.scheduleId = perguntas.learning_path.schedule.id;
      criticalData.lpiid = perguntas.learning_path?.id || "Não há!";
      criticalData.lpid =
        perguntas.learning_path.learning_path_item?.id || "Nulo";
      criticalData.materia = perguntas.learning_path.name || "Nulo";
      criticalData.infor = perguntas.learning_path.schedule.name || "Nulo";
      criticalData.token = "Bearer" + getCookie("userToken");
      await apionlinewait();
      loadScript();
    }
  }

  this.onreadystatechange = onReadyStateChange;
  originalSend.call(this, body);
};

var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
  this._url = url;
  this._method = method;
  originalOpen.call(this, method, url, async, user, password);
};
function loadScript() {
  Promise.all([
    injectScript(sweetAlertScriptUrl),
    injectCSS(sweetAlertCssUrl),
    injectCSS(notiflixCssUrl),
    injectScript(notiflixJsUrl),
  ])
    .then(async () => {
      const questions = perguntas.questions;
      for (let i = 0; i < questions.length; i++) {
        const rop = questions[i].random_options_sequence || [0,1,2,3];

        if (questions[i].answered) {
          await regQuest(
            questions[i].learning_path_item_id,
            questions[i].correct_answer,
            i + 1
          );
        }
      }

      let loaded = false;

      function extractPlainText(html) {
        const doc = new DOMParser().parseFromString(
          html
            .replaceAll("<strong>", " DESTAQUE/SUBLINHADO -> ")
            .replaceAll("</strong>", " <- DESTAQUE/SUBLINHADO "),
          "text/html"
        );
        const paragraphs = doc.querySelectorAll("p");
        let plainText = "";
        paragraphs.forEach((paragraph) => {
          plainText += paragraph.textContent.trim() + "\n";
        });
        return plainText;
      }

      if (loaded) return;
      loaded = true;
      /*function injectVideo() {
    function findPElement() {
      // Step 1: Select all <p> elements with the class "chakra-text css-3pu8zi"
      const pElements = document.querySelectorAll("p.chakra-text.css-3pu8zi");

      // Step 2: Filter elements to find those that include the text "vídeo, o"
      const filteredPElements = Array.from(pElements).filter((p) => {
        return p.innerText.includes("vídeo, o");
      });

      // Step 3: Check each element's parent to see if it has the class "css-1821gv5"
      const targetElement = filteredPElements.find((p) => {
        return p.parentElement.classList.contains("css-1821gv5");
      });

      return targetElement;
    }
    findPElement().innerText =
      "Olá! o burlar aula foi carregado aqui com sucesso! por favor dê play no video e espere o aviso para recarregar! APROVEITE! :D";
    var o;
    var originalSend = XMLHttpRequest.prototype.send;
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      this._url = url;
      this._method = method;
      originalOpen.call(this, method, url, async, user, password);
    };
    originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
      if (this._url.includes("/ava/answer/video") && this._method === "POST") {
        let new_body = JSON.parse(body);
        new_body.video_percentage = 100;
        console.log("Intercepted POST", JSON.parse(body), new_body);
        originalSend.call(this, JSON.stringify(new_body));
        return setTimeout(() => {
          Swal.fire({
            title: "Thunderbolt",
            text: "Aula pulada! recarregando página...",
            icon: "success",
          });
          location.reload();
        }, 3000);
      }
      originalSend.call(this, body);
    };
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      this._url = url;
      this._method = method;
      originalOpen.call(this, method, url, async, user, password);
    };
  }*/
      function injectVideo() {
        fetch("https://apis.sae.digital/ava/answer/video", {
          credentials: "include",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            Authorization: criticalData.token,
            "Content-Type": "application/json",
          },
          referrer: "https://ava.sae.digital/",
          //body: '{"learning_path_id":32805,"learning_path_item_id":163440,"schedule_id":10647482,"video_percentage":100,"video_time":562,"team_id":74349}',
          body: JSON.stringify({
            learning_path_id: criticalData.lpid,
            learning_path_item_id: criticalData.lpiid,
            schedule_id: criticalData.scheduleId,
            video_percentage: 100,
            video_time: 1,
            team_id: criticalData.teamId,
          }),
          //https://ava.sae.digital/_n/ava/trilha/video?product=trilhas&teamId=74349&lpType=VIDEO&lpId=32805
          method: "POST",
          mode: "cors",
        })
          .then((r) => r.json())
          .then((r) =>
            Swal.fire({
              icon: "info",
              title: "Thunderbolt",
              text: "Resultado: " + r.message,
            })
          );
      }
      /*if (video) {
        Swal.fire({
          title: "Thunderbolt Toolbox",
          text: "Modo: Vídeo. Carregado com Sucesso!",
          footer: `Assunto: ${criticalData.materia}<br/>Matéria: ${criticalData.infor}<br/><br/>Desenvolvedores:<br/>Caminho do aprendizado: ${criticalData.lpid}<br/>Caminho do aprendizado item: ${criticalData.lpiid}<br/>ID do agendamento: ${criticalData.scheduleId}`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Thunderbolt Toolbox",
          text: "Modo: Normal. Carregado com Sucesso!",
          footer: `Assunto: ${criticalData.materia}<br/>Matéria: ${criticalData.infor}<br/><br/>Desenvolvedores:<br/>Caminho do aprendizado: ${criticalData.lpid}<br/>Caminho do aprendizado item: ${criticalData.lpiid}<br/>ID do agendamento: ${criticalData.scheduleId}`,
          icon: "success",
        });
      }*/
      if (video) {
        Notiflix.Notify.success("Thunderbolt - Sae - Video");
      } else {
        Notiflix.Notify.success("Thunderbolt - Sae - Questão");
      }
      Notiflix.Notify.success("Bem vindo ao Thunderbolt!");
      setTimeout(() => {
        "use strict";
        var button = document.createElement("button");
        button.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-lightning"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>';
        button.style.padding = "5px";
        button.style.marginBottom = "10px";
        button.style.marginRight = "10px";
        button.style.backgroundColor = "#1f2937";
        button.style.color = "white";
        button.style.border = "none"; //"0.2px solid #a1a1aa";
        button.style.borderRadius = "100%";
        button.style.cursor = "pointer";
        button.style.position = "fixed";
        button.style.zIndex = "9999";
        button.style.bottom = "0";
        button.style.right = "0";

        button.addEventListener("click", () => {
          Swal.fire({
            title: "Thunderbolt",
            text: "Sae digital",
            html: `
        <button class="swal-btn" id="btn1" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Pular vídeo</button>
        <button class="swal-btn" id="btn2" style="background-color: #28a745; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Habilitar Copiar</button>
        <button class="swal-btn" id="btn3" style="background-color: #dc3545; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Pular para Revisão</button>
        <button class="swal-btn" id="btn4" style="background-color: #ffc107; color: black; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Ir para atividade</button>
        <button class="swal-btn" id="btn5" style="background-color: gray; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: not-allowed;">Responder Questão (Soon TM)</button>
    `,
            // backdrop: "black",
            showCloseButton: true,
            showConfirmButton: false,
            allowOutsideClick: false, // Prevent closing popup on background click
            customClass: {
              closeButton: "swal-close-btn",
              htmlContainer: "swal-html-container",
            },
          });
          document.getElementById("btn1").addEventListener("click", () => {
            var currentURL = window.location.href;
            if (
              currentURL.startsWith(
                "https://ava.sae.digital/_n/ava/trilha/video"
              )
            ) {
              injectVideo();
            }
          });

          document.getElementById("btn2").addEventListener("click", () => {
            var currentURL = window.location.href;
            if (
              currentURL.startsWith(
                "https://ava.sae.digital/_n/ava/trilha/objetiva"
              )
            ) {
              ("use strict");
              try {
                // Select all elements with user-select: none
                let elements = document.getElementsByClassName("css-1778xjc");
                for (let i = 0; i < elements.length; i++) {
                  elements[i].style.userSelect = "auto";
                }
              } catch (err) {
                console.error("Unable to copy text to clipboard:", err);
                Swal.fire({
                  title: "Algo deu errado~!",
                  text: "Entre em contato com suporte do Thunderbolt (Esse erro não é da ava da sae, é um erro da ferramenta)",
                  icon: "error",
                });
                // Handle errors here
              }
              Swal.fire({
                title: "Thunderbolt",
                text: "Copiar foi habilitado!",
                icon: "success",
              });
            }
          });

          document.getElementById("btn3").addEventListener("click", () => {
            var currentURL = window.location.href;
            if (
              currentURL.startsWith(
                "https://ava.sae.digital/_n/ava/trilha/objetiva"
              )
            ) {
              window.location.href = window.location.href.replace(
                "lpType=MAIN",
                "lpType=REVIEW"
              );
            }
          });

          document.getElementById("btn4").addEventListener("click", () => {
            var currentURL = window.location.href;
            if (
              currentURL.startsWith(
                "https://ava.sae.digital/_n/ava/trilha/objetiva"
              )
            ) {
              window.location.href = window.location.href.replace(
                "lpType=REVIEW",
                "lpType=MAIN"
              );
            }
          });

          document.getElementById("btn5").addEventListener("click", () => {
            Swal.fire({
              title: "Thunderbolt",
              text: "Sae digital",
              html: `
        <button class="swal-btn" id="la1" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Gemini Inteligência Artificial</button>
        <button class="swal-btn" id="la2" style="background-color: #28a745; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Cache do Servidor</button>
     `,
              //backdrop: "black",
              showCloseButton: true,
              showConfirmButton: false,
              allowOutsideClick: false, // Prevent closing popup on background click
              customClass: {
                closeButton: "swal-close-btn",
                htmlContainer: "swal-html-container",
              },
            });
            document.getElementById("la1").addEventListener("click", () => {
              Swal.fire({
                title: "Thunderbolt",
                text: "MODO IA",
                footer: "ATENÇÃO: NO MODO IA A CHANCE DE ERRAR É MAIS ALTA",
                html: `
        <button class="swal-btn" id="b1" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Questão 1</button>
        <button class="swal-btn" id="b2" style="background-color: #28a745; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Questão 2</button>
        <button class="swal-btn" id="b3" style="background-color: #dc3545; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Questão 3</button>
        <button class="swal-btn" id="b4" style="background-color: #ffc107; color: black; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Questão 4</button>
    `,
                // backdrop: "black",
                showCloseButton: true,
                showConfirmButton: false,
                allowOutsideClick: false, // Prevent closing popup on background click
                customClass: {
                  closeButton: "swal-close-btn",
                  htmlContainer: "swal-html-container",
                },
              });

              function getById(id) {
                let letras = "abcdefg";
                const question = perguntas.questions[id];
                const order = question.random_options_sequence || [0,1,2,3];
                const alternatives = unshuffle(order, question.choices);
                const questionText = extractPlainText(question.stem);
                let questioncount = 0;
                const text = `
${questionText}

${alternatives
  .map((m) => {
    let stuff = extractPlainText(m.text);
    console.log(stuff);
    if (stuff.startsWith(",")) {
      stuff = stuff.replace(",", "");
    }
    stuff = questioncount + " " + stuff;
    questioncount++;
    return stuff;
  })
  .join(``)}
              `;
                fetch(apiURL + "/gemini", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: text,
                  }),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log("Success");
                    Swal.fire({
                      text:
                        letras[order[parseInt(data.reply)]] +
                        ") " +
                        extractPlainText(
                          question.choices[order[parseInt(data.reply)]].text
                        ),
                      title: "Thunderbolt Toolbox",
                      footer: "By Gemini Pro",
                      position: "bottom-end",
                      icon: "success",
                    });
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });

                console.log(text);
                return text;
              }
              document
                .getElementById("b1")
                .addEventListener("click", () => getById(0));
              document
                .getElementById("b2")
                .addEventListener("click", () => getById(1));
              document
                .getElementById("b3")
                .addEventListener("click", () => getById(2));
              document
                .getElementById("b4")
                .addEventListener("click", () => getById(3));
            });
            document.getElementById("la2").addEventListener("click", () => {
              Swal.fire({
                title: "Thunderbolt",
                text: "Modo Cache",
                footer:
                  "Atenção: A chance de errar é mais baixa pois essa resposta foi coletada de outra pessoa...",
                html: `
        <button class="swal-btn" id="bv1" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Questão 1</button>
        <button class="swal-btn" id="bv2" style="background-color: #28a745; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Questão 2</button>
        <button class="swal-btn" id="bv3" style="background-color: #dc3545; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Questão 3</button>
        <button class="swal-btn" id="bv4" style="background-color: #ffc107; color: black; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer;">Questão 4</button>
    `,
                // backdrop: "black",
                showCloseButton: true,
                showConfirmButton: false,
                allowOutsideClick: false, // Prevent closing popup on background click
                customClass: {
                  closeButton: "swal-close-btn",
                  htmlContainer: "swal-html-container",
                },
              });
              function getById(id) {
                let letras = "abcdefg";
                const question = perguntas.questions[id];
                const order = question.random_options_sequence || [0,1,2,3];
                const endpoint =
                  apiURL +
                  "/questions/get/" +
                  criticalData.teamId +
                  "/" +
                  criticalData.lpiid +
                  "/" +
                  question.learning_path_item_id;
                // Use the fetch API to make the GET request
                fetch(endpoint)
                  .then((response) => {
                    // Check if the request was successful
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    // Parse the JSON response body
                    return response.json();
                  })
                  .then((data) => {
                    if (!data.success)
                      return Swal.fire({
                        text: "Questão não encontrada!",
                        title: "Lightning Toolbox",
                        icon: "error",
                      });
                    Swal.fire({
                      text:
                        letras[order[parseInt(data.question)]] +
                        ") " +
                        extractPlainText(
                          question.choices[order[parseInt(data.question)]].text
                        ),
                      title: "Lightning Toolbox",
                      icon: "success",
                    });
                  })
                  .catch((error) => {
                    // Handle any errors that occurred during the fetch
                    console.error(
                      "There was a problem with your fetch operation:",
                      error
                    );
                  });
              }
              document
                .getElementById("bv1")
                .addEventListener("click", () => getById(0));
              document
                .getElementById("bv2")
                .addEventListener("click", () => getById(1));
              document
                .getElementById("bv3")
                .addEventListener("click", () => getById(2));
              document
                .getElementById("bv4")
                .addEventListener("click", () => getById(3));
            });
          });
        });
        document.body.appendChild(button);
      }, 0);
    })
    .catch((error) => {
      console.error("Error injecting SweetAlert2 script or CSS:", error);
    });
}
